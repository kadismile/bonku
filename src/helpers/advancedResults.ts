import _ from 'lodash';
import moment from 'moment';
import { performance } from 'perf_hooks';
import ApplicationError from '../errors/application-error';
export const advancedResults = async (req: any, model: any, populate: any) => {
  try {
    let query, queryStr;
    const reqQuery = { ...req.query };

    const t0 = performance.now()

    const removeFields = ['select', 'sort', 'limit'];
    removeFields.forEach((param) => delete reqQuery[param]);

    if (reqQuery.field?.length) {
      let { gt, gte, lt, lte } = reqQuery;
      if (!gt || !gte || !lt || !lte || !reqQuery.in) {
        throw new ApplicationError('kindly add a gt, gte, lt, lte in your query params');
      }
      let key = reqQuery.field;
      let iin = reqQuery?.in;
      delete reqQuery.field;
      delete reqQuery?.page;
      delete reqQuery?.in;

      if (key === 'createdAt' || key === 'updatedAt') {
        for (const i in reqQuery) {
          //this is formatted to Year , Month and Day.
          reqQuery[i] = moment(reqQuery[i]).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        }
      }

      if (iin) {
        try {
          reqQuery.in = JSON.parse(iin);
          if (!Array.isArray(reqQuery.in)) {
            throw new ApplicationError('kindly provide a proper array in the in parameter');
          }
        } catch (error) {
          throw new ApplicationError("kindly provide a proper array in the 'in' parameter");
        }
      }

      queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

      if (!_.isEmpty(JSON.parse(queryStr))) {
        query = {
          [key]: queryStr ? JSON.parse(queryStr) : 1,
        };
      }
    } else  {
      if (reqQuery?.page)
      delete reqQuery?.page;
      query = reqQuery
    }

    const t1 = performance.now()
    console.log(" took  ", t1 - t0)

    if (model === 'ProductVariant') {
      query = model.find(query).select('-specifications');
    } else {
      query = model.find(query).select('-specifications');
    }


    if (populate?.length) {
      let populateQuery: any = []
      for (const item of populate) {
        let newObject = { path: item, select: getPopulatedOptions(item) }
        populateQuery.push(newObject)
      }
      await query.populate(populateQuery);
    }

    if (req.query.sort) {
      if (req.query.sort === 'ASC' || req.query.sort === 'asc') {
        query = query.sort({ createdAt: -1 });
      }
      if (req.query.sort === 'DESC' || req.query.sort === 'desc') {
        query = query.sort({ createdAt: 1 });
      }
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    if (req.query.page) {
      query = query.skip(startIndex);
    }

    if (req.query.limit) {
      query = query.limit(limit);
    }


    const results = await query;

    //pagination
    const pagination: any = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    let advancedResults = {
      count: results?.length,
      pagination,
      data: results,
    };

    const t2 = performance.now()
    console.log(" took  ", t2 - t0)

    return advancedResults;
  } catch (error: any) {
    console.log("Eroror ====>", error)
    throw new ApplicationError(error.message);
  }
};

const getPopulatedOptions = (population: string) => {
  switch (population) {
    case population = 'category':
      return 'name';
    case population = 'vendor':
      return 'businessName';
    case population = 'user':
      return 'fullName';
    case population = 'attachments':
      return 'url';
    case population = 'productBrand':
      return 'name';
  }
};