const generateSlug = require("../utils/generate-slug");

class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          slug: {
            $regex: generateSlug(this.queryString.keyword), //find title includes keyword
            $options: "i", //find not lowercase or uppercase
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  filter() {
    const queryStringCopy = { ...this.queryString };
    const removeFields = ["keyword", "page"];
    removeFields.forEach((field) => delete queryStringCopy[field]);

    this.query = this.query.find(queryStringCopy);

    return this;
  }

  pagination(resultPerpage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerpage * (currentPage - 1);
    this.query = this.query.skip(skip).limit(resultPerpage);

    return this;
  }
}

module.exports = ApiFeatures;
