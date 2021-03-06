module.exports = function (application) {

    application.route("/company/getCompany")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
        let appData = {};
        //Try to get a connection on database if has error return 500 status
        var database = application.config.database()
        database.getConnection(function (err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                //Search the users list on DB
                let companyDAO = new application.api.models.companyDAO(connection)
                companyDAO.listUsers(function (err, rows, fields) {
                    if (!err) {
                        appData["error"] = 0;
                        appData["data"] = rows;
                        res.status(200).json(appData);
                    } else {
                        appData["data"] = "No data found";
                        res.status(204).json(appData);
                    }
                });
                connection.release();
            }
        });
    });

    application.route("/company/orcamento")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
        let appData = {}
        let database = application.config.database()
        database.getConnection(function (err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                let companyDAO = new application.api.models.companyDAO(connection)
                companyDAO.getRequest(function (err, rows, fields) {
                    if(err){
                        appData["error"] = 1;
                        appData["data"] = "No Data Found";
                        res.status(500).json(appData);
                    }else{
                        res.render("company/feedOrcamento",{
                            itens: rows
                        })
                    }
                });
                connection.release();
            }
        })
    });

    application.route("/company/orcamento/:idrequest")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
        let appData = {}
        let idrequest = req.params.idrequest;
        

        let database = application.config.database()
        database.getConnection(function (err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                let companyDAO = new application.api.models.companyDAO(connection)
                companyDAO.getRequestSelected (idrequest, function (err, rows, fields) {
                    if(err){
                        appData["error"] = 1;
                        appData["data"] = "No Data Found";
                        res.status(500).json(appData);
                    }else{
                        res.render("company/detalheSolicitacao",{
                            detail: rows[0]
                        })
                    }
                });
                connection.release();
            }
        })
    });

    application.route("/company/orcamento/emissao/:idrequest")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
        res.render("company/emissao")
    })

        .post(function (req, res) {
        let appData = {}
        let id = req.user.id;
        let idrequest = req.params.idrequest;
        let database = application.config.database()

        let valor = parseFloat(req.body.valor);

        var userData = { //Data that be register in Database
            "cod_solicitacao": idrequest,
            "cod_empresa": id,
            "titorcamento": req.body.titOrcamento,
            "des_orcamento": req.body.desSolicitacao,
            "tempo_execucao": req.body.TempoTransp,
            "valor": valor,
            "empacotador":req.body.chkEmpacota,
            "seguro":req.body.chkSeguro
        }
        database.getConnection(function (err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                let companyDAO = new application.api.models.companyDAO(connection)
                companyDAO.registerRespond(userData, function (err, rows, fields) {
                    if(err){
                        console.log(err)
                        appData["error"] = 1;
                        appData["data"] = "Data not found"
                        res.status(401).send(appData);
                    }else{
                        appData["error"] = 1;
                        appData["data"] = "Success"
                        res.status(200).send(appData);
                    }
                });
                connection.release();
            }
        })
    });

    application.route("/company/aprovado")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
        let appData = {}
        let id = req.user.id;
        let database = application.config.database()
        database.getConnection(function (err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                let companyDAO = new application.api.models.companyDAO(connection)
                companyDAO.getApprove(id, function (err, rows, fields) {
                    if(err){
                        console.log(err)
                        appData["error"] = 1;
                        appData["data"] = "No Data Found";
                        res.status(500).json(appData);
                    }else{
                        res.render("company/aprovados",{
                            itens: rows
                        })
                    }
                });
                connection.release();
            }
        })
    });

    application.route("/company/aprovado/detalhe/:idApprove")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
        let appData = {}
        let idApprove = req.params.idApprove;
        let database = application.config.database()
        database.getConnection(function (err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                let companyDAO = new application.api.models.companyDAO(connection)
                companyDAO.ApproveDetails(idApprove, function (err, rows, fields) {
                    if(err){
                        console.log(err)
                        appData["error"] = 1;
                        appData["data"] = "No Data Found";
                        res.status(500).json(appData);
                    }else{
                        res.render("company/detalheAprovacao",{
                            detail: rows[0]
                        })
                    }
                });
                connection.release();
            }
        })
    });

    application.route("/company/lista")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
        let appData = {}
        let id = req.user.id;
        let database = application.config.database()
        database.getConnection(function (err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                let companyDAO = new application.api.models.companyDAO(connection)
                companyDAO.listOrcamentos(id, function (err, rows, fields) {
                    if(err){
                        console.log(err)
                        appData["error"] = 1;
                        appData["data"] = "No Data Found";
                        res.status(500).json(appData);
                    }else{
                        res.render("company/meusOrcamentos",{
                            itens: rows
                        })
                    }
                });
                connection.release();
            }
        })
    });

    application.route("/company/lista/:idOrcamento")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
        let appData = {}
        let idOrcamento = req.params.idOrcamento;
        let database = application.config.database()
        database.getConnection(function (err, connection) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Internal Server Error";
                res.status(500).json(appData);
            } else {
                let companyDAO = new application.api.models.companyDAO(connection)
                companyDAO.detailsOrcamento(idOrcamento, function (err, rows, fields) {
                    if(err){
                        console.log(err)
                        appData["error"] = 1;
                        appData["data"] = "No Data Found";
                        res.status(500).json(appData);
                    }else{
                        res.render("company/detalheOrcamento",{
                            detail: rows[0]
                        })
                    }
                });
                connection.release();
            }
        })
    });
}