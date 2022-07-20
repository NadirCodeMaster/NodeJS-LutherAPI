const HTTP = require('http-status-codes');
const PGDatabase = require('../postgre');
const User = require('../models/user');
const UserRoles = require('../enum/UserRole');
const { getUserRole } = require('../utils/utils');

let dbPool = null;

const connect = async () => {
  if (!dbPool) {
    // 1. database connect
    console.log('connecting database');
    dbPool = await PGDatabase.connect();
    console.log('connected database');
  }
};

const getMarketData = async (req, res) => {
  console.log('query', req.query);
  const conditions = [];
  const { zip, make, model, year, startDate, endDate } = req.query;

  if (zip) {
    conditions.push(`zip IN (${zip.split(',').join(', ')})`);
  }

  if (make) {
    conditions.push(`public.car_make.id_car_make = ${make}`);
  }

  if (model) {
    conditions.push(`public.car_model.id_car_model = ${model}`);
  }

  if (year) {
    conditions.push(`model_year = ${year}`);
  }

  conditions.push(
    `date_sold >= to_date('${startDate}', 'yyyy-mm-dd') and date_sold <= to_date('${endDate}', 'yyyy-mm-dd')`
  );

  try {
    await connect();
    // 2.
    const query = `
    SELECT 
    zip as "buyer_zip", 
    public.car_make.name as "make", 
    public.car_model.name as "model", 
    model_year,
    public.dealerships.name as "dealership_name",
    public.dealerships.postal as "dealership_zip",
    public.dealerships.company_id as "is_luther",
    condition, 
    total, 
    date_sold
  FROM public.registration_data
    JOIN public.car_make ON public.registration_data.make_id = public.car_make.id_car_make
    JOIN public.car_model ON public.registration_data.model_id = public.car_model.id_car_model
    JOIN public.dealerships ON public.registration_data.dealership_id = public.dealerships.id
  ${conditions.length ? 'WHERE' : ''} ${conditions.join(' AND ')}
  ORDER BY date_sold desc
    `;

    const query2 = `
    SELECT 
      MAX(date_sold)
  FROM public.registration_data
    JOIN public.car_make ON public.registration_data.make_id = public.car_make.id_car_make
    JOIN public.car_model ON public.registration_data.model_id = public.car_model.id_car_model
    JOIN public.dealerships ON public.registration_data.dealership_id = public.dealerships.id
  ${conditions.length ? 'WHERE' : ''} ${conditions.join(' AND ')}
    `;
    const results = await Promise.all([
      PGDatabase.select(dbPool, query),
      PGDatabase.select(dbPool, query2),
    ]);

    res.send(results);
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

const getFilterData = async (req, res) => {
  try {
    await connect();
    let requests = [];
    const queries = [
      'SELECT * FROM public.car_make ORDER BY id_car_make LIMIT 50',
      'SELECT * FROM public.car_model ORDER BY id_car_model LIMIT 50',
    ];
    requests = queries.map((query) => PGDatabase.select(dbPool, query));
    const results = await Promise.all(requests);

    res.send(results);
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

const getMakeData = async (req, res) => {
  try {
    await connect();
    const query =
      'SELECT DISTINCT(car_make.name) as name, car_make.id_car_make FROM registration_data JOIN public.car_make ON car_make.id_car_make = registration_data.make_id ORDER BY public.car_make.name';

    const result = await PGDatabase.select(dbPool, query);

    res.send(result);
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

const getModelData = async (req, res) => {
  const { make } = req.query;

  try {
    await connect();
    let query = '';
    if (make) {
      query = `SELECT DISTINCT(car_model.name) as name, car_model.id_car_model FROM registration_data JOIN public.car_model ON car_model.id_car_model = registration_data.model_id WHERE car_model.id_car_make = ${make} ORDER BY public.car_model.name`;
      // query = `SELECT * FROM public.car_model WHERE id_car_make = ${make} ORDER BY id_car_model`;
    } else {
      query = `SELECT DISTINCT(car_model.name) as name, car_model.id_car_model FROM registration_data JOIN public.car_model ON car_model.id_car_model = registration_data.model_id ORDER BY public.car_model.name`;
    }

    const result = await PGDatabase.select(dbPool, query);

    res.send(result);
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

const getDealershipData = async (req, res) => {
  try {
    await connect();

    const query =
      'SELECT name, id FROM dealerships WHERE company_id = 1 GROUP BY name, id';

    const result = await PGDatabase.select(dbPool, query);

    res.send(result);
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

const getSalesData = async (req, res) => {
  const { dealership, startDate, endDate } = req.query;

  try {
    await connect();

    let where = [];
    if (dealership != '0') {
      where.push(`public.sales.dealership_id = ${dealership}`);
    }
    if (startDate) {
      where.push(`sales.date_sold >= '${startDate}'`);
    }
    if (endDate) {
      where.push(`sales.date_sold <= '${endDate}'`);
    }
    where = where.length ? `WHERE ${where.join(' and ')}` : '';

    const query = `SELECT count(car_model.name) as solds, car_model.name as model, car_make.name as make
    FROM public.sales JOIN public.vehicles ON sales.vin = vehicles.vin JOIN public.car_model ON car_model.id_car_model = vehicles.model_id JOIN public.car_make ON car_make.id_car_make = car_model.id_car_make ${where} group by make, model ORDER BY solds DESC;`;

    const result = await PGDatabase.select(dbPool, query);

    res.send(result);
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

const getLeadsData = async (req, res) => {
  const { dealership, startDate, endDate } = req.query;

  try {
    await connect();

    let where = [];
    if (dealership != undefined && dealership != '0') {
      where.push(`public.leads.dealership_id = ${dealership}`);
    }
    if (startDate) {
      where.push(`leads.date_lead_in >= '${startDate}'`);
    }
    if (endDate) {
      where.push(`leads.date_lead_in <= '${endDate}'`);
    }
    where = where.length ? `WHERE ${where.join(' and ')}` : '';

    const query = `
      SELECT car_model.name as model, car_make.name as make, count(*) as leads FROM
      (
        SELECT vin, make_id, model_id FROM public.leads LEFT JOIN public.vehicles ON public.vehicles.vin = ANY (public.leads.sought_vehicle_vins) ${where}
      ) as VTable
      LEFT JOIN car_model ON car_model.id_car_model = VTable.model_id
      LEFT JOIN car_make ON car_make.id_car_make = car_model.id_car_make
      group by make, model ORDER BY leads DESC;
    `;

    const result = await PGDatabase.select(dbPool, query);

    res.send(result);
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

const getViewsData = async (req, res) => {
  const { dealership, startDate, endDate } = req.query;

  try {
    await connect();

    let where = [];
    if (dealership != undefined && dealership != '0') {
      where.push(`public.inventory.dealership_id = ${dealership}`);
    }
    if (startDate) {
      where.push(`views.date_occurred >= '${startDate}'`);
    }
    if (endDate) {
      where.push(`views.date_occurred <= '${endDate}'`);
    }
    where = where.length ? `WHERE ${where.join(' and ')}` : '';

    const query = `SELECT sum(views.srp) as srp, sum(views.vdp) as vdp, car_model.name as model, car_make.name as make
    FROM views JOIN inventory ON views.vin = inventory.vin JOIN vehicles ON views.vin = vehicles.vin JOIN car_model ON car_model.id_car_model = vehicles.model_id JOIN car_make ON car_make.id_car_make = car_model.id_car_make ${where} group by make, model ORDER BY srp DESC;`;

    const result = await PGDatabase.select(dbPool, query);

    res.send(result);
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

const getRevenueData = async (req, res) => {
  const { dealership, startDate, endDate } = req.query;

  try {
    await connect();

    let where = [];
    if (dealership != '0') {
      where.push(`public.sales.dealership_id = ${dealership}`);
    }
    if (startDate) {
      where.push(`sales.date_sold >= '${startDate}'`);
    }
    if (endDate) {
      where.push(`sales.date_sold <= '${endDate}'`);
    }
    where = where.length ? `WHERE ${where.join(' and ')}` : '';

    const query = `SELECT sum(public.sales.sale_price) as revenue, date_sold FROM public.sales ${where} group by date_sold ORDER BY date_sold;`;

    const result = await PGDatabase.select(dbPool, query);

    res.send(result);
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

const getInventoryData = async (req, res) => {
  const { email } = req.auth;

  try {
    await connect();

    const user = await User.where({
      email: { $regex: email, $options: 'i' },
    }).findOne();

    if (user) {
      const role = getUserRole(user);

      let where = ['public.inventory.date_out_stock IS NULL'];

      if (
        [UserRoles.MANAGER, UserRoles.SALESPERSON].includes(role) &&
        user.dealerships &&
        user.dealerships.length > 0
      ) {
        where.push(
          `public.inventory.dealership_id = ANY ('{${user.dealerships.join(
            ','
          )}}'::int[])`
        );
      }

      where = ` WHERE ${where.join(' and ')} `;

      const query = `
        SELECT public.dealerships.name as dealership, public.car_make.name as make, public.car_model.name as model, COUNT(*) as availablecount 
        FROM public.inventory 
        JOIN public.dealerships ON public.dealerships.id = public.inventory.dealership_id
        JOIN public.vehicles ON public.vehicles.vin = public.inventory.vin 
        JOIN public.car_model ON public.car_model.id_car_model = public.vehicles.model_id 
        JOIN public.car_make ON public.car_make.id_car_make = public.car_model.id_car_make
        ${where} 
        GROUP BY dealership, make, model
        ORDER BY dealership, availablecount DESC;
      `;

      const result = await PGDatabase.select(dbPool, query);

      res.send(result);
    } else {
      res.status(409);
      res.json({ message: 'User not existed!' });
      return;
    }
  } catch (e) {
    res.status(HTTP.UNPROCESSABLE_ENTITY).send(e);
  }
};

module.exports = {
  getMarketData,
  getFilterData,
  getMakeData,
  getModelData,
  getDealershipData,
  getSalesData,
  getLeadsData,
  getViewsData,
  getRevenueData,
  getInventoryData,
};
