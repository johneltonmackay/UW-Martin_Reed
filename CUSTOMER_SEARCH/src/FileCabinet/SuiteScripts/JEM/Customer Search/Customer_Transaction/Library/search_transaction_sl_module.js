/**
 * @NAPIVersion 2.1
 */
define(["N/ui/serverWidget", "N/search", "N/task", "N/file", "N/record", "../Library/search_transaction_sl_mapping.js", 'N/runtime', 'N/url', 'N/ui/message', 'N/format', 'N/currentRecord'],

    (serverWidget, search, task, file, record, slMapping, runtime, url, message, format, currentRecord) => {

        //#constants
        const FORM = {};
        const ACTIONS = {};

        //#global functions
        FORM.buildForm = (options) => {
            try {
                log.debug('buildForm options', options)
                let objParam = options.parameters

                let sublistParam = {}
           
                let arrSearchResults = runSearch(objParam.entityId)

                if(arrSearchResults.length > 0){
                    sublistParam.searchResults = arrSearchResults
                } else {
                    sublistParam.searchResults = []
                }

                var objForm = serverWidget.createForm({
                    title: options.title,
                    hideNavBar: false
                });
                
                addButtons({
                    form: objForm,

                });

                addFields({
                    form: objForm,
                    data: arrSearchResults.length
                });

                addSublistFields({
                    form: objForm,  
                    data: sublistParam
                });

                // objForm.clientScriptModulePath = slMapping.SUITELET.form.CS_PATH;

                return objForm;
            } catch (err) {
                log.error('ERROR_BUILD_FORM:', err.message)
            }
        }

        const addButtons = (options) => {
            try {
                const submitButton = options.form.addSubmitButton({
                    label: slMapping.SUITELET.form.buttons.SUBMIT.label,
                });
                submitButton.isHidden = false;

            } catch (err) {
                log.error("BUILD_FORM_ADD_BUTTONS_ERROR", err.message);
            }
        };

        const addFields = (options) => {
            try {
                let intTotalOrders = options.data;
                for (var strKey in slMapping.SUITELET.form.fields) {
                    options.form.addField(slMapping.SUITELET.form.fields[strKey]);
                    var objField = options.form.getField({
                        id: slMapping.SUITELET.form.fields[strKey].id,
                        container: 'custpage_fieldgroup'
                    });

                    if (slMapping.SUITELET.form.fields[strKey].isInLine) {
                        objField.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.INLINE
                        });
                    }

                    if (slMapping.SUITELET.form.fields[strKey].ishidden) {
                        objField.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.HIDDEN
                        });
                    }
                }
            } catch (err) {
                log.error("BUILD_FORM_ADD_BODY_FILTERS_ERROR", err.message);
            }
        };

        const addSublistFields = (options) => {
            try {
                let arrFilteredItems = []
                let arrAddedFieldId = []
                let objSublistParam = options.data;

                let arrSearchResults = objSublistParam.searchResults

                let sublist = options.form.addSublist({
                    id: 'custpage_sublist',
                    type: serverWidget.SublistType.LIST,
                    label: 'Results',
                    tab: 'custpage_tabid'
                });
        
                for (var strKey in slMapping.SUITELET.form.sublistfields) {
                    sublist.addField(slMapping.SUITELET.form.sublistfields[strKey]);

                    var objField = sublist.getField({
                        id: slMapping.SUITELET.form.sublistfields[strKey].id,
                    });

                    if (slMapping.SUITELET.form.sublistfields[strKey].ishidden) {
                        objField.updateDisplayType({
                            displayType: serverWidget.FieldDisplayType.HIDDEN
                        });
                    }
                }

                arrSearchResults.forEach((data, index) => {
                    for (const key in data) {
                        let value = data[key];
                        if (value !== undefined && value !== null && value !== "") {

                            value = (value === true) ? 'Yes' : (value === false) ? 'No' : value;

                            if (key == 'custpage_view'){
                                var strRecUrl = url.resolveRecord({
                                    recordType: data.custpage_recordtype,
                                    recordId: value
                                });
                                let recLink = `<a href='${strRecUrl}' target="_blank" rel="noopener noreferrer">VIEW</a>`
                                sublist.setSublistValue({
                                    id: key,
                                    line: index,
                                    value: recLink,
                                });
                            } else {
                                sublist.setSublistValue({
                                    id: key,
                                    line: index,
                                    value: value
                                });
                            }
                        }
                    }
                });

        
            } catch (err) {
                log.error("BUILD_FORM_ADD_SUBLIST_ERROR", err.message);
            }
        };
        

        const runSearch = (entityId) => {

            let arrFieldText = [
                'custpage_customer',
                'custpage_next_email',
                'custpage_status'
            ]
 
            try {
                let arrSearchResults = []
                let objSavedSearch = search.create({
                    type: 'invoice',
                    filters: [
                        ['type', 'anyof', 'CustInvc'],
                        'AND',
                        ['mainline', 'is', 'T'],
                        'AND',
                        ['amountremaining', 'notequalto', '0.00'],
                        'AND',
                        ['status', 'anyof', 'CustInvc:A'],
                        'AND',
                        ['formulatext: {custbody_lm_aging_bracket_}', 'startswith', 'Age: '],
                        'AND',
                        ['name', 'anyof', entityId],             
                    ],
                    columns: [
                        search.createColumn({ name: 'entity', label: 'custpage_customer' }),
                        search.createColumn({ name: 'formulahtml', formula: 'CASE WHEN ({customer.balance}-{customer.creditlimit} >0) THEN \'<div style="height:15px;width:15px;display:block;margin:0 auto;border:1px solid #afc437;border-radius:15px;-moz-border-radius:15px;-webkit-border-radius:15px;background-color:red;" title="Red"></div>\'  ELSE \'<div style="height:15px;width:15px;display:block;margin:0 auto;border:1px solid #428bca;border-radius:15px;-moz-border-radius:15px;-webkit-border-radius:15px;background-color:DarkCyan;" title="Green"></div>\' END', label: 'custpage_cr_lmt' }),
                        search.createColumn({ name: 'tranid', label: 'custpage_invoice_number' }),
                        search.createColumn({ name: 'duedate', label: 'custpage_due' }),
                        search.createColumn({ name: 'fxamount', label: 'custpage_invoice_amount' }),
                        search.createColumn({ name: 'fxamountremaining', sort: search.Sort.DESC, label: 'custpage_outstanding' }),
                        search.createColumn({ name: 'daysoverdue', label: 'custpage_days_late' }),
                        search.createColumn({ name: 'custbody_lm_aging_bracket_', label: 'custpage_aging_profile' }),
                        search.createColumn({ name: 'formulahtml', formula: '  \'<a href="#" onclick="window.open(\'\'/app/crm/common/crmmessagehistory.nl?fkcol=kTrandoc&id=\'||{internalid}||\'\'\',\'\'selection\'\',\'\'dependent=yes,height=1200,width=1400,scrollbars=no,statusbar=no,titlebar=no,menubar=no,resizeable=yes,location=no\'\');">   <span style="color:DarkCyan">View</a>\'', label: 'custpage_emails' }),
                        search.createColumn({ name: 'formulahtml', formula: '  \'<a href="#" onclick="window.open(\'\'/app/crm/common/crmnoteshistory.nl?fkcol=ktrandoc&id=\'||{internalid}||\'\'\',\'\'selection\'\',\'\'dependent=yes,height=1200,width=1400,scrollbars=no,statusbar=no,titlebar=no,menubar=no,resizeable=yes,location=no\'\');">   <span style="color:DarkCyan">View</a>\'', label: 'custpage_notes' }),
                        search.createColumn({ name: 'formulahtml', formula: ' \'<a href="#" onclick="window.open(\'\'/app/crm/common/note.nl?l=T&refresh=usernotes&perm=TRAN_CUSTINVC&xnew=T&transaction=\'||{internalid}||\'\'\',\'\'selection\'\',\'\'dependent=yes,height=1200,width=1400,scrollbars=no,statusbar=no,titlebar=no,menubar=no,resizeable=yes,location=no\'\');">   <span style="color:blue">Add</a>\'', label: 'custpage_new_note' }),
                        search.createColumn({ name: 'custbody_lm_nextemailtosend', label: 'custpage_next_email' }),
                        search.createColumn({ name: 'custbody_lm_nextsenddate', label: 'custpage_next_email_date' }),
                        search.createColumn({ name: 'custbody_lm_email_status', label: 'custpage_status' }),
                        search.createColumn({ name: 'custbody_lm_reminder_comments_', label: 'custpage_comments' }),
                        search.createColumn({ name: 'custbody_lm_follow_up_date', label: 'custpage_follow_up' }),
                        search.createColumn({ name: 'custbody_lm_donotsendreminders', label: 'custpage_stop' }),
                        search.createColumn({ name: 'custbody_final_dunning_activated_', label: 'custpage_cust_level_final' }),
                        search.createColumn({ name: 'recordtype', label: 'custpage_recordtype'}),
                        search.createColumn({ name: 'internalid', label: 'custpage_view'}),
                    ],

                });

                let searchResultCount = objSavedSearch.runPaged().count;
            
                if (searchResultCount !== 0) {
                    let pagedData = objSavedSearch.runPaged({ pageSize: 1000 });
            
                    for (let i = 0; i < pagedData.pageRanges.length; i++) {
                        let currentPage = pagedData.fetch(i);
                        let pageData = currentPage.data;
                        var pageColumns = currentPage.data[0].columns;
                        if (pageData.length > 0) {
                            for (let pageResultIndex = 0; pageResultIndex < pageData.length; pageResultIndex++) {
                                let objData = {};
                                pageColumns.forEach(function (result) {
                                    let resultLabel = result.label;
                                    if(arrFieldText.includes(resultLabel)){
                                        objData[resultLabel] = pageData[pageResultIndex].getText(result);  
                                    } else {
                                        objData[resultLabel] = pageData[pageResultIndex].getValue(result);                                   
                                    }
                                })
                                arrSearchResults.push(objData);
                            }
                        }   
                    }
                }
            log.debug(`runSearch arrSearchResults ${Object.keys(arrSearchResults).length}`, arrSearchResults);

            return arrSearchResults;

            } catch (err) {
                log.error('Error: runSearch', err.message);
            }
        }

        return { FORM, ACTIONS }
    });
