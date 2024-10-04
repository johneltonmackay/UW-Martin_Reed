/**
 * @NApiVersion 2.1
 */
define([],
    
    () => {

        const SUITELET = {
            scriptid: 'customscript_customer_search_sl',
            deploymentid: 'customdeploy_customer_search_sl',
            search_transaction_scriptid: 'customscript_search_transaction_sl',
            search_transaction_deploymentid: 'customdeploy_search_transaction_sl',
            search_comments_scriptid: 'customscript_search_comments_sl',
            search_comments_deploymentid: 'customdeploy_search_comments_sl',
            form: {
                title: "LM Dunning Control Center - Customer",
                fields: {
                    SUBSIDIARY: {
                        id: "custpage_subsidiary",
                        type: "TEXT",
                        label: "Subsidiary",
                    },
                    CUSTOMER_NAME: {
                        id: "custpage_customer_name",
                        type: "TEXT",
                        label: "Customer Name",
                    },
                    DUNNUNG_ACTIVE: {
                        id: "custpage_dunning_inactive",
                        type: "TEXT",
                        label: "Dunning Inactive",
                    },
                    NEXT_DUNNING_REVIEW: {
                        id: "custpage_next_dunning_review",
                        type: "TEXT",
                        label: "Next Dunning Review",
                    },
                    DATE_FROM: {
                        id: "custpage_date_from",
                        type: "TEXT",
                        label: "From",
                    },
                    DATE_TO: {
                        id: "custpage_date_to",
                        type: "TEXT",
                        label: "To",
                    },
                },
                buttons: {
                    SUBMIT: {
                        label: 'FILTER',
                    },
                },
                sublistfields: {
                    CUST_DUNNING: {
                        id: "custpage_cust_dunning",
                        label: "Cust Dunning",
                        type: 'text',
                    },
                    INV_DUNNING: {
                        id: "custpage_inv_dunning",
                        label: "Inv Dunning",
                        type: 'text',
                    },
                    CUSTOMER: {
                        id: "custpage_customer",
                        label: "Customer",
                        type: 'text',
                    },
                    CR_HOLD: {
                        id: "custpage_cr_hold",
                        label: "CR Hold",
                        type: "text",
                    },
                    OPEN_BAL: {
                        id: "custpage_open_bal",
                        label: "Open Bal",
                        type: "text",
                    },
                    OVERDUE: {
                        id: "custpage_overdue",
                        label: "Overdue",
                        type: "text",
                    },
                    OPEN_INV: {
                        id: "custpage_open_inv",
                        label: "Open Inv",
                        type: "text",
                    },
                    LATE_INV: {
                        id: "custpage_late_inv",
                        label: "Late inv",
                        type: "text",
                    },
                    AVG_AGE: {
                        id: "custpage_avg_age",
                        label: "Avg Age",
                        type: "text",
                    },
                    IN_TERMS: {
                        id: "custpage_in_terms",
                        label: "In Terms",
                        type: "text",
                    },
                    DUE_7: {
                        id: "custpage_due_7",
                        label: "Due in 7",
                        type: "text",
                    },
                    DUE_30: {
                        id: "custpage_due_30",
                        label: "+ 0-30",
                        type: "text",
                    },
                    DUE_60: {
                        id: "custpage_due_60",
                        label: "+ 31-60",
                        type: "text",
                    },
                    DUE_90: {
                        id: "custpage_due_90",
                        label: "+ 61-90",
                        type: "text",
                    },
                    DUE_91: {
                        id: "custpage_due_91",
                        label: "91+",
                        type: "text",
                    },
                    EMAILS: {
                        id: "custpage_email",
                        label: "Emails",
                        type: "text",
                    },
                    NOTES: {
                        id: "custpage_notes",
                        label: "Notes",
                        type: "text",
                    },
                    NEW_NOTES: {
                        id: "custpage_new_notes",
                        label: "New Note",
                        type: "text",
                    },
                    NEXT_EMAIL_DATE: {
                        id: "custpage_next_email_date",
                        label: "Next Email Date",
                        type: "text",
                    },
                    OFF: {
                        id: "custpage_off",
                        label: "Off?",
                        type: "text",
                    },
                    FINAL: {
                        id: "custpage_final",
                        label: "Final?",
                        type: "text",
                    },
                    NEXT_REVIEW: {
                        id: "custpage_next_review",
                        label: "Next Review",
                        type: "text",
                    },
                    COMMENT: {
                        id: "custpage_comment",
                        label: "Comment",
                        type: "text",
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
