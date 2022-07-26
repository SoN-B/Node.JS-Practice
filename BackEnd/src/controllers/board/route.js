"use strict";

const { auth } = require('../../middleware/verifyJWT');
const express = require('express');
const router = express.Router();

const ctrl = require('./service');

router.route("/")
    .get(ctrl.boardGet)
    .post(auth, ctrl.boardPost)

router.get("/new", ctrl.newView)

router.route("/:id")
    .get(ctrl.boardView_id)
    .post(ctrl.boardDelete_id)

router.route("/:id/edit")
    .get(ctrl.editView_id)
    .post(ctrl.boardEdit_id)

router.get("/:id/auth", auth, ctrl.auth)

module.exports = router;
