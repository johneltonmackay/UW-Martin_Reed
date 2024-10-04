/**
 * @NApiVersion 2.1
 */
define([],
    
    () => {

        const SUITELET = {
            scriptid: 'customscript_search_comments_sl',
            deploymentid: 'customdeploy_search_comments_sl',
            form: {
                title: "LM ** Set Customer Dunning Comment and Holds**",
                fields: {

                },
                buttons: {
                    GO_BACK: {
                        label: 'GO BACK',
                    },
                },
                sublistfields: {
                    VIEW: {
                        id: "custpage_view",
                        label: "VIEW",
                        type: 'text',
                    },
                    COMPANY: {
                        id: "custpage_company",
                        label: "Company",
                        type: 'text',
                    },
                    SET_EMAIL_ADD: {
                        id: "custpage_set_email_add",
                        label: "Set Email Address",
                        type: 'text',
                    },
                    SET_MULTI_EMAIL_ADD: {
                        id: "custpage_set_multi_email_add",
                        label: "Set Multiple Email Addresses",
                        type: 'text',
                    },
                    COMMENTS: {
                        id: "custpage_comments",
                        label: "Comments",
                        type: "text",
                    },
                    FOLLOW_UP: {
                        id: "custpage_follow_up",
                        label: "Follow Up",
                        type: "text",
                    },
                    STOP_DUNNING_EMAIL: {
                        id: "custpage_stop_dunning_email",
                        label: "Stop Dunning Email",
                        type: "text",
                    },
                    FINALIZE_DUNNING: {
                        id: "custpage_finalize_dunning",
                        label: "Finalize Dunning ***FINAL ACTION***",
                        type: "text",
                    },
                    DATE_OF_FINAL_ACTION: {
                        id: "custpage_date_of_final_action",
                        label: "*** Date of Final Action ***",
                        type: "text",
                    },
                    RECORD_TYPE: {
                        id: "custpage_recordtype",
                        label: "Transaction Type",
                        type: "text",
                        ishidden: true
                    },
                },

                // CS_PATH: '../CS/live_mfg_data_cs.js',
            },
        }

        const NOTIFICATION = {
            REQUIRED: {
                title: 'REQUIRED FIELDS MISSING',
                message: "Kindly ensure all mandatory fields are completed before proceeding with the preview."
            },
        }

        return { SUITELET, NOTIFICATION }

    });
