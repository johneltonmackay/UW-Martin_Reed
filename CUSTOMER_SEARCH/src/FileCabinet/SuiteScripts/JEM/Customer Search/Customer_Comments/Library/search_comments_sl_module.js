/**
 * @NAPIVersion 2.1
 */
define(["N/ui/serverWidget", "N/search", "N/task", "N/file", "N/record", "../Library/search_comments_sl_mapping.js", 'N/runtime', 'N/url', 'N/ui/message', 'N/format', 'N/currentRecord'],

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
 
            try {
                let arrSearchResults = []
                let objSavedSearch = search.create({
                    type: 'customer',
                    filters: [
                        ['internalid', 'anyof', entityId],
                    ],
                    columns: [
                        search.createColumn({ name: 'companyname', label: 'custpage_company' }),
                        search.createColumn({ name: 'email', label: 'custpage_set_email_add' }),
                        search.createColumn({ name: 'custentity_lm_multiple_emails_for_inv_', label: 'custpage_set_multi_email_add' }),
                        search.createColumn({ name: 'custentity_lm_dunnings_cust_comments_', label: 'custpage_comments' }),
                        search.createColumn({ name: 'custentity_lm_next_review_dun_date_', label: 'custpage_follow_up' }),
                        search.createColumn({ name: 'custentity_lm_dontsendemails', label: 'custpage_stop_dunning_email' }),
                        search.createColumn({ name: 'custentity_final_dunning_activated_', label: 'custpage_finalize_dunning' }),
                        search.createColumn({ name: 'custentity_final_dunning_last_activation', label: 'custpage_date_of_final_action' }),
                        search.createColumn({ name: 'formulatext', formula: '\'customer\'', label: 'custpage_recordtype' }),
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

        return { FORM, ACTIONS }
    });
