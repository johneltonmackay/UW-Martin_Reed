/**
 * @NApiVersion 2.1
 */
define([],
    
    () => {

        const SUITELET = {
            scriptid: 'customscript_search_transaction_sl',
            deploymentid: 'customdeploy_search_transaction_sl',
            form: {
                title: "LM Dunning+ Customer Transactions",
                fields: {
                    NAME: {
                        id: "custpage_name",
                        type: "TEXT",
                        label: "Name",
                    },
                    AGE_BRACKET: {
                        id: "custpage_age_bracket",
                        type: "TEXT",
                        label: "Enter Age Bracket Text",
                    },
                    DOCUMENT_NUMBER: {
                        id: "custpage_document_number",
                        type: "TEXT",
                        label: "Document Number/ID",
                    },
                },
                buttons: {
                    SUBMIT: {
                        label: 'FILTER',
                    },
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
                    CUSTOMER: {
                        id: "custpage_customer",
                        label: "Customer",
                        type: 'text',
                    },
                    CR_LMT: {
                        id: "custpage_cr_lmt",
                        label: "Cr Lmt",
                        type: 'text',
                    },
                    INV_NUMBER: {
                        id: "custpage_invoice_number",
                        label: "Inv #",
                        type: 'text',
                    },
                    DUE: {
                        id: "custpage_due",
                        label: "Due",
                        type: "text",
                    },
                    INV_AMT: {
                        id: "custpage_invoice_amount",
                        label: "Inv Amt",
                        type: "text",
                    },
                    OUTSTANDING: {
                        id: "custpage_outstanding",
                        label: "Outstanding",
                        type: "text",
                    },
                    DAYS_LATE: {
                        id: "custpage_days_late",
                        label: "Days Late",
                        type: "text",
                    },
                    AGING_PROFILE: {
                        id: "custpage_aging_profile",
                        label: "Aging Profile",
                        type: "text",
                    },
                    EMAILS: {
                        id: "custpage_emails",
                        label: "Emails",
                        type: "text",
                    },
                    NOTES: {
                        id: "custpage_notes",
                        label: "Notes",
                        type: "text",
                    },
                    NEW_NOTE: {
                        id: "custpage_new_note",
                        label: "New Note",
                        type: "text",
                    },
                    NEXT_EMAIL: {
                        id: "custpage_next_email",
                        label: "Next Email",
                        type: "text",
                    },
                    NEXT_EMAIL_DATE: {
                        id: "custpage_next_email_date",
                        label: "Next Email Date",
                        type: "text",
                    },
                    STATUS: {
                        id: "custpage_status",
                        label: "Status",
                        type: "text",
                    },
                    COMMENTS: {
                        id: "custpage_comments",
                        label: "Comments",
                        type: "text",
                    },
                    FOLLOW_UP: {
                        id: "custpage_follow_up",
                        label: "Follow up",
                        type: "text",
                    },
                    STOP: {
                        id: "custpage_stop",
                        label: "Stop",
                        type: "text",
                    },
                    CUST_LEVEL_FINAL: {
                        id: "custpage_cust_level_final",
                        label: "Cust Level Final",
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
