/**
 * @NAPIVersion 2.1
 */
define(["N/ui/serverWidget", "N/search", "N/task", "N/file", "N/record", "../Library/customer_search_sl_mapping.js", 'N/runtime', 'N/url', 'N/ui/message', 'N/format', 'N/currentRecord'],

    (serverWidget, search, task, file, record, slMapping, runtime, url, message, format, currentRecord) => {

        //#constants
        const FORM = {};
        const ACTIONS = {};

        //#global functions
        FORM.buildForm = (options) => {
            try {
                // log.debug('buildForm options', options)
                let sublistParam = {}
                let arrSearchResults = runSearch()

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
                }

                arrSearchResults.forEach((data, index) => {
                    for (const key in data) {
                        let value = data[key];
                        if (value !== undefined && value !== null && value !== "") {

                            value = (value === true) ? 'Yes' : (value === false) ? 'No' : value;

                            sublist.setSublistValue({
                                id: key,
                                line: index,
                                value: value
                            });
                        }
                    }
                });

        
            } catch (err) {
                log.error("BUILD_FORM_ADD_SUBLIST_ERROR", err.message);
            }
        };
        

        const runSearch = () => {
 
            try {
                let urlSearchTransaction = getUrl('searchTransaction')
                let urlSearchComments = getUrl('searchComments')
                let arrSearchResults = []
                let objSavedSearch = search.create({
                    type: 'customer',
                    filters: [
                        ['transaction.type', 'anyof', 'CustInvc'],
                        'AND',
                        ['transaction.status', 'anyof', 'CustInvc:A'],
                        'AND',
                        ['transaction.mainline', 'is', 'T'],
                        'AND',
                        ['internalid', 'anyof', '@ALL@'],                    
                    ],
                    columns: [
                        search.createColumn({
                            name: 'formulahtml',
                            summary: search.Summary.MAX,
                            formula: `'<a href="${urlSearchComments}&entityId=' || {internalid} || '" target="_blank">Update</a>'`,
                            label: 'custpage_cust_dunning'
                        }),
                        search.createColumn({
                            name: 'formulahtml',
                            summary: search.Summary.MAX,
                            formula: `\'<a href=${urlSearchTransaction}&entityId=' || {internalid} || '> <span style="color:blue"> Update  </a>\'`,
                            label: 'custpage_inv_dunning'
                        }),
                        search.createColumn({ name: 'formulatext', summary: search.Summary.GROUP, formula: 'NVL(COALESCE({companyname}, {entityid},{altname}),\'\')', label: 'custpage_customer' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: 'CASE WHEN ({balance}-{creditlimit} >0) THEN \'<div style="height:15px;width:15px;display:block;margin:0 auto;border:1px solid #afc437;border-radius:15px;-moz-border-radius:15px;-webkit-border-radius:15px;background-color:red;" title="Red"></div>\'  ELSE \'<div style="height:15px;width:15px;display:block;margin:0 auto;border:1px solid #428bca;border-radius:15px;-moz-border-radius:15px;-webkit-border-radius:15px;background-color:DarkCyan;" title="Green"></div>\' END', label: 'custpage_cr_hold' }),
                        search.createColumn({ name: 'balance', summary: search.Summary.MAX, function: 'round', label: 'custpage_open_bal' }),
                        search.createColumn({ name: 'overduebalance', summary: search.Summary.MAX, function: 'round', sort: search.Sort.DESC, label: 'custpage_overdue' }),
                        search.createColumn({ name: 'internalid', join: 'transaction', summary: search.Summary.COUNT, label: 'custpage_open_inv' }),
                        search.createColumn({ name: 'formulanumeric', summary: search.Summary.SUM, formula: 'case when ({transaction.daysoverdue}>0) then 1 else 0 end', label: 'custpage_late_inv' }),
                        search.createColumn({ name: 'daysopen', join: 'transaction', summary: search.Summary.AVG, function: 'roundToTenths', label: 'custpage_avg_age' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: 'case when sum(case when({transaction.daysoverdue}<1) then 1 else 0 end) > 0 then \'<y style="color:black"><div style="text-align: right;background-color:rgba(30, 178, 204, 0.25)">\'||to_char(sum(case when({transaction.daysoverdue}<1) then {transaction.amountremaining} else 0 end),\'99,999,999\')||\'</y>\'  else \'<y style="color:black"><div style="text-align: right"">\'||\'\'||\'</y>\'  end', label: 'custpage_in_terms' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: 'case when sum(case when({transaction.duedate}-trunc(sysdate) <7 AND {transaction.duedate}-trunc(sysdate)>0) then {transaction.amountremaining} else 0 end) > 0then \'<y style="color:black"><div style="text-align: right;background-color:rgba(30, 204, 65, 0.26)">\'||to_char(sum(case when({transaction.duedate}-trunc(sysdate) <7 AND {transaction.duedate}-trunc(sysdate)>0) then {transaction.amountremaining} else 0 end),\'99,999,999\')||\'</y>\'   else \'<y style="color:black"><div style="text-align: right"">\'||\'\'||\'</y>\'  end', label: 'custpage_due_7' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: 'case when sum(case when({transaction.daysoverdue}>0 AND {transaction.daysoverdue}<31) then {transaction.amountremaining} else 0 end) > 0 then \'<y style="color:black"><div style="text-align: right;background-color:rgba(225, 250, 0, 0.15)">\'||to_char(sum(case when({transaction.daysoverdue}>0 AND {transaction.daysoverdue}<31) then {transaction.amountremaining} else 0 end),\'99,999,999\')||\'</y>\'    else \'<y style="color:black"><div style="text-align: right"">\'||\'\'||\'</y>\'  end', label: 'custpage_due_30' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: 'case when sum(case when({transaction.daysoverdue}>30 AND {transaction.daysoverdue}<61) then {transaction.amountremaining} else 0 end) > 0 then \'<y style="color:black"><div style="text-align: right;background-color:rgba(250, 150, 0, 0.27)">\'||to_char(sum(case when({transaction.daysoverdue}>30 AND {transaction.daysoverdue}<61) then {transaction.amountremaining} else 0 end),\'99,999,999\')||\'</y>\' else \'<y style="color:black"><div style="text-align: right"">\'||\'\'||\'</y>\' end', label: 'custpage_due_60' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: 'case when sum(case when({transaction.daysoverdue}>60 AND {transaction.daysoverdue}<91) then {transaction.amountremaining} else 0 end) > 0 then \'<y style="color:black"><div style="text-align: right;background-color:rgba(255, 47, 15, 0.23)">\'||to_char(sum(case when({transaction.daysoverdue}>60 AND {transaction.daysoverdue}<91) then {transaction.amountremaining} else 0 end),\'99,999,999\')||\'</y>\' else \'<y style="color:black"><div style="text-align: right"">\'||\'\'||\'</y>\' end', label: 'custpage_due_90' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: 'case when sum(case when({transaction.daysoverdue}>90) then {transaction.amountremaining} else 0 end) > 0 then \'<y style="color:white"><div style="text-align: right;background-color:rgba(250, 48, 30, 0.85)">\'||to_char(sum(case when({transaction.daysoverdue}>90) then {transaction.amountremaining} else 0 end),\'99,999,999\')||\'</y>\' else \'<y style="color:black"><div style="text-align: right"">\'||\'\'||\'</y>\' end', label: 'custpage_due_91' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: '\'<a href="#" onclick="window.open(\'\'/app/crm/common/crmmessagehistory.nl?fkcol=kEntity&id=\'||{internalid}||\'\'\',\'\'selection\'\',\'\'dependent=yes,height=1200,width=1400,scrollbars=no,statusbar=no,titlebar=no,menubar=no,resizeable=yes,location=no\'\');">   <span style="color:DarkCyan">View</a>\'', label: 'custpage_email' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: '  \'<a href="#" onclick="window.open(\'\'/app/crm/common/crmnoteshistory.nl?fkcol=kEntity&id=\'||{internalid}||\'\'\',\'\'selection\'\',\'\'dependent=yes,height=1200,width=1400,scrollbars=no,statusbar=no,titlebar=no,menubar=no,resizeable=yes,location=no\'\');">   <span style="color:DarkCyan">View</a>\'', label: 'custpage_notes' }),
                        search.createColumn({ name: 'formulahtml', summary: search.Summary.MAX, formula: ' \'<a href="#" onclick="window.open(\'\'/app/crm/common/note.nl?l=T&refresh=usernotes&perm=LIST_CUSTJOB&entity=\'||{internalid}||\'\'\',\'\'selection\'\',\'\'dependent=yes,height=1200,width=1400,scrollbars=no,statusbar=no,titlebar=no,menubar=no,resizeable=yes,location=no\'\');">   <span style="color:blue">Add</a>\'', label: 'custpage_new_notes' }),
                        search.createColumn({ name: 'custbody_lm_nextsenddate', join: 'transaction', summary: search.Summary.MIN, label: 'custpage_next_email_date' }),
                        search.createColumn({ name: 'custentity_lm_dontsendemails', summary: search.Summary.GROUP, label: 'custpage_off' }),
                        search.createColumn({ name: 'custentity_final_dunning_activated_', summary: search.Summary.GROUP, label: 'custpage_final' }),
                        search.createColumn({ name: 'custentity_lm_next_review_dun_date_', summary: search.Summary.GROUP, label: 'custpage_next_review' }),
                        search.createColumn({ name: 'custentity_lm_dunnings_cust_comments_', summary: search.Summary.GROUP, label: 'custpage_comment' }),
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
                                    objData[resultLabel] = pageData[pageResultIndex].getValue(result);                                   
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

        const getUrl = (key) => {
            let strScript = null
            let strDeployment = null
            if (key == 'searchTransaction'){
                strScript = slMapping.SUITELET.search_transaction_scriptid
                strDeployment = slMapping.SUITELET.search_transaction_deploymentid
            } else if (key == 'searchComments'){
                strScript = slMapping.SUITELET.search_comments_scriptid
                strDeployment = slMapping.SUITELET.search_comments_deploymentid
            }
            var sURL = url.resolveScript({
                scriptId : strScript,
                deploymentId : strDeployment,
            });
            log.debug('getUrl sURL', sURL)
            return sURL;
        }


        return { FORM, ACTIONS }
    });
