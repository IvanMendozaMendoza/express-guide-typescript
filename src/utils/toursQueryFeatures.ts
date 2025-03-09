// import { Request } from "express";
// import Tour from "../models/tourModel.js";

// filepath: /workspaces/codespaces-blank/natours/src/utils/toursQueryFeatures.ts


class TourFeatures {
    public query: any;
    private queryString: any;

    constructor(query: any, queryString: any) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryCopy = { ...this.queryString };
        const excludedFields = ["sort", "page", "limit", "fields"];
        excludedFields.forEach((el) => delete queryCopy[el]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortFields = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortFields);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    paginate() {
        const page = +(this.queryString.page ?? 1);
        const limit = +(this.queryString.limit ?? 100);
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

export default TourFeatures;