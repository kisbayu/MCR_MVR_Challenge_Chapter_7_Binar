const {User} = require('../models')
const { Op } = require('sequelize')
const fs = require('fs')
const bcrypt = require('bcrypt')
const errorHandler = require('../utils/error')
const jwt = require('jsonwebtoken')

