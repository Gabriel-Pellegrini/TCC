var moment = require('moment');
module.exports = function (application) {


    application.route("/user/solicitacao")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {

            let appData = {};
            let id = req.user.id;
            let database = application.config.database()
            database.getConnection(function (err, connection) {
                if (err) {
                    appData["error"] = 1;
                    appData["data"] = "Internal Server Error";
                    res.status(500).json(appData);
                } else {
                    let userDAO = new application.api.models.userDAO(connection)
                    userDAO.listSolicitacao(id, function (err, rows, fields) {
                        if (!err) {
                            appData["error"] = 0;
                            appData["data"] = rows;
                            res.render("user/minhasSolicitacoes", {
                                itens: rows,
                            });
                        } else {
                            appData["data"] = "No data found";
                            console.log(err)
                            res.status(404).json(appData);
                        }
                    });
                    connection.release();
                }
            })
        });

    application.route("/user/solicitacao/:idSolicitacao")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {

            let appData = {};
            let idSolicitacao = req.params.idSolicitacao

            let database = application.config.database()
            database.getConnection(function (err, connection) {
                if (err) {
                    appData["error"] = 1;
                    appData["data"] = "Internal Server Error";
                    res.status(500).json(appData);
                } else {
                    let userDAO = new application.api.models.userDAO(connection)
                    userDAO.detailsSolicitacao(idSolicitacao, function (err, rows, fields) {
                        if (!err) {
                            appData["error"] = 0;
                            appData["data"] = rows;
                            res.render("user/detalheSolicitacao", {
                                detail: rows[0],
                            });
                        } else {
                            appData["data"] = "No data found";
                            console.log(err)
                            res.status(404).json(appData);
                        }
                    });
                    connection.release();
                }
            })
        });

    application.route("/user/orcamento/solicitacao")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
            let appData = {};
            let id = req.user.id;
            let database = application.config.database()
            database.getConnection(function (err, connection) {
                if (err) {
                    appData["error"] = 1;
                    appData["data"] = "Internal Server Error";
                    res.status(500).json(appData);
                } else {
                    let userDAO = new application.api.models.userDAO(connection)
                    userDAO.getAddress(id, function (err, rows, fields) {
                        if (!err) {
                            appData["error"] = 0;
                            appData["data"] = rows;
                            res.render("user/solicitacao", {
                                address: rows
                            });
                        } else {
                            appData["data"] = "No data found";
                            console.log(err)
                            res.status(404).json(appData);
                        }
                    });
                    connection.release();
                }
            })
        })
        
        .post(function(req, res){
            let appData = {};
            let id = req.user.id;
            
            var data = moment(req.body.data, "DD/MM/YYYY").toDate();
        
            let valor = parseFloat(req.body.valorestimado);
        
            let userData = { 
                "cod_usuario": id,
                "tit_solicitacao": req.body.titSolicitacao,
                "des_solicitacao": req.body.desSolicitacao,
                "cod_endereco_origem": req.body.endOrigem,
                "cod_endereco_destino": req.body.endDestino,
                "vlr_estimado_carga": valor,
                "data_servico": data,
                "hora_servico": req.body.hora
            }
            // res.send(userData).json
            let database = application.config.database()
            database.getConnection(function (err,connection) {
                if (err) {
                    appData["error"] = 1;
                    appData["data"] = "Internal Server Error";
                    res.status(500).json(appData);
                } else {
                    let userDAO = new application.api.models.userDAO(connection)
                    userDAO.registerRequest(userData, function (err, rows, fields) {
                        if (err) {
                            appData["data"] = "No data found";
                            console.log(err)
                            res.status(404).json(appData);
                        } else {
                            appData["data"] = "Save";
                            res.status(200).json(appData);
                        }
                    });
                    connection.release();
                }
            })
        });

    application.route("/user/orcamento/detalhe/:idorcamento")
        .all(application.config.strategy.authenticate())
        .get(function (req, res) {
            let appData = {};
            let idorcamento = req.params.idorcamento;
            let database = application.config.database()
            database.getConnection(function (err, connection) {
                    if (err) {
                        appData["error"] = 1;
                        appData["data"] = "Internal Server Error";
                        res.status(500).json(appData);
                    } else {
                        let userDAO = new application.api.models.userDAO(connection)
                        userDAO.getDetails(idorcamento, function (err, rows) {
                            if (err) {
                                appData["data"] = "No data found";
                                console.log(err)
                                res.status(404).json(appData);

                            } else {
                                appData["error"] = 0;
                                appData["data"] = rows;
                                res.render("user/detalheResposta", {
                                    detail: rows[0],
                                });
                            }
                        });
                        connection.release();
                    }
                })
        })

        .post(function (req, res) {
                    let appData = {};
                    let id = req.user.id;

                    var data = moment(req.body.data, "DD/MM/YYYY").toDate();

                    let valor = parseFloat(req.body.valorestimado);

                    let userData = {
                        "cod_usuario": id,
                        "des_solicitacao": req.body.titSolicitacao,
                        "cod_endereco_origem": req.body.endOrigem,
                        "cod_endereco_destino": req.body.endDestino,
                        "valor_estimado": valor,
                        "data_servico": data,
                        "hora_servico": req.body.hora

                    }
                    // res.send(userData).json
                    let database = application.config.database()
                    database.getConnection(function (err, connection) {
                        if (err) {
                            appData["error"] = 1;
                            appData["data"] = "Internal Server Error";
                            res.status(500).json(appData);
                        } else {
                            let userDAO = new application.api.models.userDAO(connection)
                            userDAO.registerRequest(userData, function (err, rows, fields) {
                                if (err) {
                                    appData["data"] = "No data found";
                                    console.log(err)
                                    res.status(404).json(appData);
                                } else {
                                    appData["data"] = "Save";
                                    res.status(200).json(appData);
                                }
                            });
                            connection.release();
                        }
                    })
        });

    application.route("/user/orcamento/resposta")
                .all(application.config.strategy.authenticate())
                .get(function (req, res) {
                    let appData = {};
                    let id = req.user.id;
                    let database = application.config.database()
                    database.getConnection(function (err, connection) {
                        if (err) {
                            appData["error"] = 1;
                            appData["data"] = "Internal Server Error";
                            res.status(500).json(appData);
                        } else {
                            let userDAO = new application.api.models.userDAO(connection)
                            userDAO.getAnswer(id, function (err, rows, fields) {
                                if (err) {
                                    appData["data"] = "No data found";
                                    console.log(err)
                                    res.status(404).json(appData);

                                } else {
                                    appData["error"] = 0;
                                    appData["data"] = rows;
                                    res.render("user/respostas", {
                                        itens: rows,
                                    });
                                }
                            });
                            connection.release();
                        }
                    })
                });

    application.route("/user/orcamento/detalhe/:idorcamento")
                .all(application.config.strategy.authenticate())
                .get(function (req, res) {
                    let appData = {};
                    let idorcamento = req.params.idorcamento;
                    let database = application.config.database()
                    database.getConnection(function (err, connection) {
                        if (err) {
                            appData["error"] = 1;
                            appData["data"] = "Internal Server Error";
                            res.status(500).json(appData);
                        } else {
                            let userDAO = new application.api.models.userDAO(connection)
                            userDAO.getDetails(idorcamento, function (err, rows, fields) {
                                if (err) {
                                    appData["data"] = "No data found";
                                    console.log(err)
                                    res.status(404).json(appData);

                                } else {
                                    appData["error"] = 0;
                                    appData["data"] = rows;
                                    res.render("user/detalheResposta", {
                                        detail: rows[0],
                                    });
                                }
                            });
                            connection.release();
                        }
                    })
                });

    application.route("/user/orcamento/resposta/:idorcamento")
                .all(application.config.strategy.authenticate())
                .post(function (req, res) {
                    let appData = {};
                    let id = req.user.id;
                    let idorcamento = req.params.idorcamento;

                    var hora = req.body.hora
                    var data = moment(req.body.data, "DD/MM/YYYY").toDate();

                    let valor = parseFloat(req.body.valorestimado);

                    let userData = {
                        "cod_usuario": id,
                        "cod_solicitacao": req.body.idSolicitacao,
                        "cod_empresa": req.body.idEmpresa,
                        "cod_orcamento": idorcamento,
                    }
                    // res.send(userData).json
                    let database = application.config.database()
                    database.getConnection(function (err, connection) {
                        if (err) {
                            appData["error"] = 1;
                            appData["data"] = "Internal Server Error";
                            res.status(500).json(appData);
                        } else {
                            let userDAO = new application.api.models.userDAO(connection)
                            userDAO.updateStatusSolicitacao(req.body.idSolicitacao, function (err, rows, fields) {
                                if (err) {
                                    appData["data"] = "No data found";
                                    console.log(err)
                                    res.status(404).json(appData);
                                } else {
                                    userDAO.updateStatusOrcamento(idorcamento, function (err, rows, fields){
                                        if(err){
                                            appData["data"] = "No data found";
                                            console.log(err)
                                            res.status(404).json(appData);
                                        } else{
                                            userDAO.Approve(userData, function (err, rows, fields) {
                                                if (err) {
                                                    appData["data"] = "No data found";
                                                    console.log(err)
                                                    res.status(404).json(appData);
                                                } else {
                                                    appData["data"] = "Save";
                                                    res.status(200).json(appData);
                                                }
                                            });
                                        }
                                    })
                                }
                            });
                            connection.release();
                        }
                    })
                });

    application.route("/user/address")
                .all(application.config.strategy.authenticate())
                .get(function (req, res) {
                    res.render("user/enderecos");
                });

    application.route("/user/address/register")
                .all(application.config.strategy.authenticate())
                .post(function (req, res) {
                    let appData = {};
                    let id = req.user.id;

                    let userData = {
                        "cod_uf": req.body.UF,
                        "cod_municipio": req.body.municipio,
                        "CEP": req.body.cep,
                        "endereco": req.body.endereco,
                        "numero": req.body.numero,
                        "complemento": req.body.complemento,
                        "bairro": req.body.bairro,
                        "flg_usu_emp": 'U',
                        "cod_usu_emp": id,
                    }
                    // res.send(userData).json
                    let database = application.config.database()
                    database.getConnection(function (err, connection) {
                        if (err) {
                            appData["error"] = 1;
                            appData["data"] = "Internal Server Error";
                            res.status(500).json(appData);
                        } else {
                            let userDAO = new application.api.models.userDAO(connection)
                            userDAO.registerAddress(userData, function (err, rows, fields) {
                                if (err) {
                                    appData["data"] = "No data found";
                                    console.log(err)
                                    res.status(404).json(appData);
                                } else {
                                    appData["data"] = "Save";
                                    res.status(200).json(appData);
                                }
                            });
                            connection.release();
                        }
                    })
                });
}