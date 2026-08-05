import * as engineeringService from "../../src/services/engineeringService.js";
import { AssessmentStatus } from "#services/assessments/assessmentStatus";

describe("engineeringService", () => {

    function createContext() {
        return {
            interaction: {
                id: "INT001",
                effects: {
                    EFF001: [
                        {
                            hazard: "HD001",
                            distanceRule: "BD03",
                            inputBasis: "NEQ",
                            protectionLevel: "PL001",
                            constraints: ["CV001"]
                        },
                    ]
                }
            },
            request: {
                direction: "forward",
                explosiveHazard: "HD001",
                neq: 2000
            }
        };

    }

    describe("Validation", () => {

        test("Throws an error if context is not provided", () => {

            const context = null;
            expect(() => {
                engineeringService.process(context);
            }).toThrow("engineeringService requires a context.");
        
        });

        test("Throws an error if context.request is not provided", () => {

            const context = {
                interaction: {}
            };
            expect(() => {
                engineeringService.process(context);
            }).toThrow("engineeringService requires context.request.");
        
        });

        test("Throws an error if context.interaction is not provided", () => {

            const context = {
                request: {}
            };
            expect(() => {
                engineeringService.process(context);
            }).toThrow("engineeringService requires context.interaction.");
        
        });

    });
   
    describe("Core Pipeline", () => {

        test("Processes a simple BD assessment", () => {

            const context = createContext();
            engineeringService.process(context);
            
            const assessment = context.assessments[0];
            expect(assessment.calculation).toBeDefined();
            expect(assessment.calculation.rawResult).toBeDefined();
            expect(assessment.calculation.transformedResult).toBeDefined();
        });

        test("Processes a simple BD assessment in reverse", () => {
            const context = createContext();
            context.request.direction = "reverse";
            delete context.request.neq;
            context.request.distance = 35;
            engineeringService.process(context);
            
            const assessment = context.assessments[0];
            expect(assessment.calculation).toBeDefined();
            expect(assessment.calculation.rawResult).toBeDefined();
            expect(assessment.calculation.transformedResult).toBeDefined();
        });

        test("Processes a forward DFD assessment", () => {
            const context = {
                interaction: {
                    id: "INT055",
                    effects: {
                        EFF002: [
                            {
                                hazard: "HD001",
                                distanceRule: "DFD08",
                                inputBasis: "NEQ",
                                protectionLevel: "PL003",
                                constraints: []
                            }
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 3000
                }
            };

            engineeringService.process(context);
            
            const assessment = context.assessments[0];
            expect(assessment.calculation).toBeDefined();
            expect(assessment.calculation.rawResult).toBeDefined();
            expect(assessment.calculation.transformedResult).toBeDefined();
        });

        test("Processes a reverse DFD assessment", () => {
            const context = {
                interaction: {
                    id: "INT055",
                    effects: {
                        EFF002: [
                            {
                                hazard: "HD001",
                                distanceRule: "DFD08",
                                inputBasis: "NEQ",
                                protectionLevel: "PL003",
                                constraints: []
                            }
                        ]
                    }
                },
                request: {
                    direction: "reverse",
                    explosiveHazard: "HD001",
                    distance: 100
                }
            };

            engineeringService.process(context);
            
            const assessment = context.assessments[0];
            expect(assessment.calculation).toBeDefined();
            expect(assessment.calculation.rawResult).toBeDefined();
            expect(assessment.calculation.transformedResult).toBeDefined();
        });
    });

    describe("Formula Behaviour", () => {
        
        test("FORM004 Forward", () => {
            const context = {
                interaction: {
                    id: "INT055",
                    effects: {
                        EFF004: [
                            {
                                hazard: "HD004",
                                distanceRule: "FD60",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: []
                            }
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD004",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            
            const assessment = context.assessments[0];
            expect(assessment.calculation).toBeDefined();
            expect(assessment.calculation.rawResult).toBeDefined();
            expect(assessment.calculation.transformedResult).toBeDefined();
        });

        test("FORM004 Reverse", () => {
            const context = {
                interaction: {
                    id: "INT055",
                    effects: {
                        EFF004: [
                            {
                                hazard: "HD004",
                                distanceRule: "FD60",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: []
                            }
                        ]
                    }
                },
                request: {
                    direction: "reverse",
                    explosiveHazard: "HD004",
                    distance: 100
                }
            };

            engineeringService.process(context);
            
            const assessment = context.assessments[0];
            //console.log(assessment);
            expect(assessment.result.status).toBe(AssessmentStatus.NOT_SOLVABLE);
            expect(assessment.calculation).toBeUndefined();
        });

    });

    describe("Status Assessments", () => {

        test("Assess No NEQ Outcome", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF004: [
                            {
                                hazard: "HD001",
                                status: "NO_QD",
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            
            const assessment = context.assessments[0];
            expect(assessment.result.status).toBe(AssessmentStatus.NO_QUANTITY_DISTANCE);
        });

        test("Assess N/A Outcome", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF003: [
                            {
                                hazard: "HD002",
                                status: "N_A",
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD002",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            
            const assessment = context.assessments[0];
            console.log(assessment);
            expect(assessment.result.status).toBe(AssessmentStatus.NOT_APPLICABLE);
        });

    });

    describe("Multiple Hazards", () => {
        test("Processes multiple hazards in a single interaction", () => {
            const context = {
                interaction: {
                    "id": "INT001",
                    "source": {
                        "document": "AASTP-1",
                        "reference": {
                            "table": 1,
                            "row": 1,
                            "column": "a"
                        }
                    },
                    "conditions": {
                        "pesType": "PES001",
                        "esType": "ES001",
                        "orientation": {
                            "pes": "rear",
                            "es": "rear"
                        }
                    },
                    "effects": {
                        "EFF001": [
                            {
                                "hazard": "HD001",
                                "distanceRule": "BD03",
                                "inputBasis": "NEQ",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD002",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD004",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD009",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            }
                        ],
                    "EFF002": [
                            {
                                "hazard": "HD001",
                                "distanceRule": "BD03",
                                "inputBasis": "NEQ",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD002",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD004",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD009",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            }
                        ],
                        "EFF003": [
                            {
                                "hazard": "HD002",
                                "status": "N_A"
                            },
                            {
                                "hazard": "HD003",
                                "status": "N_A"
                            }
                        ],
                        "EFF004": [
                            {
                                "hazard": "HD004",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD005",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD006",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD009",
                                "status": "NO_QD"
                            }
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            
            expect(context.assessments).toHaveLength(2);
            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[1].effectId).toBe("EFF002");
        });

        test("No matching hazards", () => {
            const context = {
                interaction: {
                    "id": "INT001",
                    "source": {
                        "document": "AASTP-1",
                        "reference": {
                            "table": 1,
                            "row": 1,
                            "column": "a"
                        }
                    },
                    "conditions": {
                        "pesType": "PES001",
                        "esType": "ES001",
                        "orientation": {
                            "pes": "rear",
                            "es": "rear"
                        }
                    },
                    "effects": {
                        "EFF003": [
                            {
                                "hazard": "HD002",
                                "status": "N_A"
                            },
                            {
                                "hazard": "HD003",
                                "status": "N_A"
                            }
                        ],
                        "EFF004": [
                            {
                                "hazard": "HD004",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD005",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD006",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD009",
                                "status": "NO_QD"
                            }
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            
            expect(context.assessments).toHaveLength(0);
        });

        test("Mixed matching/non-matching effects", () => {
            const context = {
                interaction: {
                    "id": "INT001",
                    "source": {
                        "document": "AASTP-1",
                        "reference": {
                            "table": 1,
                            "row": 1,
                            "column": "a"
                        }
                    },
                    "conditions": {
                        "pesType": "PES001",
                        "esType": "ES001",
                        "orientation": {
                            "pes": "rear",
                            "es": "rear"
                        }
                    },
                    "effects": {
                        "EFF001": [
                            {
                                "hazard": "HD001",
                                "distanceRule": "BD03",
                                "inputBasis": "NEQ",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD002",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD004",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD009",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            }
                        ],
                    "EFF002": [
                            {
                                "hazard": "HD002",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD004",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD009",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            }
                        ],
                        "EFF003": [
                            {
                                "hazard": "HD001",
                                "distanceRule": "BD03",
                                "inputBasis": "NEQ",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },             
                            {
                                "hazard": "HD003",
                                "status": "N_A"
                            }
                        ],
                        "EFF004": [
                            {
                                "hazard": "HD004",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD005",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD006",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD009",
                                "status": "NO_QD"
                            }
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            console.log(context.assessments);
            
            expect(context.assessments).toHaveLength(2);
            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[1].effectId).toBe("EFF003");
        });

        test("Check state machine values", () => {
            const context = {
                interaction: {
                    "id": "INT001",
                    "source": {
                        "document": "AASTP-1",
                        "reference": {
                            "table": 1,
                            "row": 1,
                            "column": "a"
                        }
                    },
                    "conditions": {
                        "pesType": "PES001",
                        "esType": "ES001",
                        "orientation": {
                            "pes": "rear",
                            "es": "rear"
                        }
                    },
                    "effects": {
                        "EFF001": [
                            {
                                "hazard": "HD001",
                                "distanceRule": "BD03",
                                "inputBasis": "NEQ",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD002",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD004",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD009",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            }
                        ],
                    "EFF002": [
                            {
                                "hazard": "HD001",
                                "distanceRule": "BD03",
                                "inputBasis": "NEQ",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD002",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD004",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            },
                            {
                                "hazard": "HD009",
                                "distanceRule": "BD03",
                                "inputBasis": "MCE",
                                "protectionLevel": "PL001",
                                "constraints": ["CV001"]
                            }
                        ],
                        "EFF003": [
                            {
                                "hazard": "HD004",
                                "status": "N_A"
                            },
                            {
                                "hazard": "HD003",
                                "status": "N_A"
                            }
                        ],
                        "EFF004": [
                            {
                                "hazard": "HD004",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD005",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD006",
                                "status": "NO_QD"
                            },
                            {
                                "hazard": "HD009",
                                "status": "NO_QD"
                            }
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD004",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            
            expect(context.assessments).toHaveLength(4);

            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[0].calculation).toBeDefined();
            expect(context.assessments[0].calculation.rawResult).toBeDefined();
            expect(context.assessments[0].calculation.transformedResult).toBeDefined();
            expect(context.assessments[0].result.status).toBe(AssessmentStatus.COMPLETE);

            expect(context.assessments[1].effectId).toBe("EFF002");
            expect(context.assessments[1].calculation).toBeDefined();
            expect(context.assessments[1].calculation.rawResult).toBeDefined();
            expect(context.assessments[1].calculation.transformedResult).toBeDefined();
            expect(context.assessments[1].result.status).toBe(AssessmentStatus.COMPLETE);

            expect(context.assessments[2].effectId).toBe("EFF003");
            expect(context.assessments[2].calculation).toBeUndefined();
            expect(context.assessments[2].result.status).toBe(AssessmentStatus.NOT_APPLICABLE);

            expect(context.assessments[3].effectId).toBe("EFF004");
            expect(context.assessments[3].calculation).toBeUndefined();
            expect(context.assessments[3].result.status).toBe(AssessmentStatus.NO_QUANTITY_DISTANCE);
        });
    });

    describe("Error Propagation", () => {
        test("Propagates error: Unknown Distance Rule", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD99",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            expect(() => {
                engineeringService.process(context);
            }).toThrow("Unknown distance rule 'BD99'");
        });
    });

    describe("Branch Boundaries", () => {
        test("First QD branch boundary", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 1
                }
            };
            engineeringService.process(context);

            expect(context.assessments).toHaveLength(1);
            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[0].calculation).toBeDefined();
            expect(context.assessments[0].calculation.rawResult).toBeDefined();
            expect(context.assessments[0].calculation.transformedResult).toBeDefined();
            expect(context.assessments[0].result.status).toBe(AssessmentStatus.COMPLETE);
        });

        test("Last QD branch boundary", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 500000
                }
            };
            engineeringService.process(context);
            expect(context.assessments).toHaveLength(1);
            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[0].calculation).toBeDefined();
            expect(context.assessments[0].calculation.rawResult).toBeDefined();
            expect(context.assessments[0].calculation.transformedResult).toBeDefined();
            expect(context.assessments[0].result.status).toBe(AssessmentStatus.COMPLETE);
        });

        test("Exceeding last QD branch boundary", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 500001
                }
            };
            engineeringService.process(context);
            expect(context.assessments).toHaveLength(1);
            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[0].calculation).toBeUndefined();
            expect(context.assessments[0].result.status).toBe(AssessmentStatus.ABOVE_MAXIMUM);
        });

        test(("First distance branch boundary"), () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD05",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "reverse",
                    explosiveHazard: "HD001",
                    distance: 2
                }
            };
            engineeringService.process(context);
            expect(context.assessments).toHaveLength(1);
            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[0].calculation).toBeDefined();
            expect(context.assessments[0].calculation.rawResult).toBeDefined();
            expect(context.assessments[0].calculation.transformedResult).toBeDefined();
            expect(context.assessments[0].result.status).toBe(AssessmentStatus.COMPLETE);
        });

        test("Last distance branch boundary", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD05",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "reverse",
                    explosiveHazard: "HD001",
                    distance: 88
                }
            };
            engineeringService.process(context);
            expect(context.assessments).toHaveLength(1);
            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[0].calculation).toBeDefined();
            expect(context.assessments[0].calculation.rawResult).toBeDefined();
            expect(context.assessments[0].calculation.transformedResult).toBeDefined();
            expect(context.assessments[0].result.status).toBe(AssessmentStatus.COMPLETE);
        });

        test("Below first branch boundary", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD05",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "reverse",
                    explosiveHazard: "HD001",
                    distance: 1
                }
            };
            engineeringService.process(context);
            expect(context.assessments).toHaveLength(1);
            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[0].calculation).toBeUndefined();
            expect(context.assessments[0].result.status).toBe(AssessmentStatus.BELOW_MINIMUM);
        });

        test("Above last branch boundary", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD05",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "reverse",
                    explosiveHazard: "HD001",
                    distance: 89
                }
            };
            engineeringService.process(context);
            expect(context.assessments).toHaveLength(1);
            expect(context.assessments[0].effectId).toBe("EFF001");
            expect(context.assessments[0].calculation).toBeUndefined();
            expect(context.assessments[0].result.status).toBe(AssessmentStatus.ABOVE_MAXIMUM);
        });
    });

    describe("Repository Integrity", () => {
        test("Unknown Formula", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD99",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            expect(() => {
                engineeringService.process(context);
            }).toThrow("Unknown distance rule 'BD99'");
        });
    
        test("Unknown Protection Level", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL99",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            expect(() => {
                engineeringService.process(context);
            }).toThrow("Unknown protection level 'PL99'");
        });

        test("Unknown Constraint", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV99"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            expect(() => {
                engineeringService.process(context);
            }).toThrow("Unknown constraint 'CV99'");
        });
    });

    describe("Formula Parameter Resolution", () => {
        test("Resolves formula parameters from branch and formula", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            expect(context.assessments[0].calculation.parameters.coefficient).toEqual(0.5);
            expect(context.assessments[0].calculation.engineeringUnits.input).toEqual("kg");
            const transformation = context.assessments[0].calculation.transformations[0];
            expect(transformation.id).toBe("TR001");
            expect(transformation.name).toBe("round_up_metre");
            expect(transformation.expression).toBe("ceil(value)");
        });
    });

    describe("State Machine Invariants", () => {
        test("Confirm outputs if status is COMPLETE", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            const assessment = context.assessments[0];
            expect(assessment.result.status).toBe(AssessmentStatus.COMPLETE);
            expect(assessment.calculation.rawResult).toBeDefined();
            expect(assessment.calculation.transformedResult).toBeDefined();
        });

        test("Confirm outputs are undefined if status is NOT_APPLICABLE", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                            {
                                hazard: "HD002",
                                status: "N_A"
                            }
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD002",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            const assessment = context.assessments[0];
            expect(assessment.result.status).toBe(AssessmentStatus.NOT_APPLICABLE);
            expect(assessment.calculation).toBeUndefined();
        }); 

        test("Confirm outputs are undefined if status is NO_QUANTITY_DISTANCE", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            },
                            {
                                hazard: "HD004",
                                status: "NO_QD"
                            }
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD004",
                    neq: 2000
                }
            };

            engineeringService.process(context);
            const assessment = context.assessments[0];
            expect(assessment.result.status).toBe(AssessmentStatus.NO_QUANTITY_DISTANCE);
            expect(assessment.calculation).toBeUndefined();
        });

    });

    describe("Idempotency", () => {
        test("Confirm idempotency of process", () => {
            const context = {
                interaction: {
                    id: "INT001",
                    effects: {
                        EFF001: [
                            {
                                hazard: "HD001",
                                distanceRule: "BD03",
                                inputBasis: "NEQ",
                                protectionLevel: "PL001",
                                constraints: ["CV001"]
                            }
                        ]
                    }
                },
                request: {
                    direction: "forward",
                    explosiveHazard: "HD001",
                    neq: 2000
                }
            };

            const original = structuredClone(context.request);

            engineeringService.process(context);
            expect(context.request).toEqual(original);
            const assessment1 = structuredClone(context.assessments);
            engineeringService.process(context);
            expect(context.assessments).toEqual(assessment1);
        });
    });

});
