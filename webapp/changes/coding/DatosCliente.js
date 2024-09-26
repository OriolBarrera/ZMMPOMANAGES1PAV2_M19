/***
@controller Name:sap.suite.ui.generic.template.ObjectPage.view.Details,
*@viewId:ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP
*/
jQuery.sap.require("sap.suite.ui.generic.template.extensionAPI.extensionAPI");
sap.ui.define([
    'sap/ui/core/mvc/ControllerExtension',
    'sap/suite/ui/generic/template/extensionAPI/extensionAPI',
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/ui/core/ValueState",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text"
    // ,'sap/ui/core/mvc/OverrideExecution' 

],
    function (
        ControllerExtension,
        extensionAPI,
        MessageBox,
        Dialog,
        DialogType,
        ValueState,
        Button,
        ButtonType,
        Text
        // ,OverrideExecution
    ) {


        "use strict";
        var CV_ATTACHMENT_SRV = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/CV_ATTACHMENT_SRV/");
        var ZMM_CO_SRV = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_CO_SRV/");
        var ZMM_ATTACHMENT_CLASIF_SRV = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_ATTACHMENT_CLASIF_SRV/");

        return ControllerExtension.extend("customer.zmmpomanages1pa.DatosCliente", {
            metadata: {
                methods: {
                    onValueRequestBPC: {
                        public: true,
                        final: false
                    },
                    onChangeDireccion: {
                        public: true,
                        final: false
                    }
                }

            },
            override: {
                onInit: function () {
                    // BEGIN REFACTOR TAXONOMIA - RJV - 05/06/2023
                    this.getView().setModel(new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCDS_F4_RELTAXGRU_CDS"), "ZCDS_F4_RELTAXGRU_CDS");
                    this.getView().setModel(new sap.ui.model.json.JSONModel(), "JSON_MDL");
                    this.getView().setModel(new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_PURCHASEGROUP_SH_REL_TABLE_SRV"), "ZMM_PURCHASEGROUP_SH_REL_TABLE_SRV");
                    // END REFACTOR TAXONOMIA - RJV - 05/06/2023
                    /* BORRAR REFACTOR 
                    //BEGIN JMD: ESFU CO124
                    this.onInitTaxonomia();
                    //END JMD: ESFU CO124
                    */
                    //BEGIN RJV: ESFU CO76
                    this.oBool = false;
                    this.oList = null;
                    this.bFlag = false;
                    this.bAdded = false;
                    // Detail
                    this.oList1 = null;
                    this.bFlag1 = false;
                    this.bAdded1 = false;
                    // General
                    this.bFlag2 = false;
                    this.bFlag3 = false;
                    //BEGIN RJV: ESFU CO76
                },
                onAfterRendering: async function () {
                    //that  = this;
                    this.getView().setModel(new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMMPU_0001_SRV"), "odataHelp");
                    this.getView().setModel(new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMMPU_0002_SRV"), "ZMMPU_0002");
                    this.getView().setModel(new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMMPU_0004_SRV"), "ZMMPU_0004");
                    this.getView().setModel(new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_CO39_SRV"), "oSIMHelp");
                    this.getView().setModel(new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_PUR_PO_MAINTAIN_V2_SRV"), "odataModelExt");
                    this.getView().setModel(new sap.ui.model.json.JSONModel({ editZOR: false, BP: {}, _isPeriodificable: false }), "viewCfg");
                    this.getView().setModel(new sap.ui.model.json.JSONModel(), "oMessageModel");
                    this.Flag = false;
                    this.firstStep = true;



                    //await this.getServiceSociedadGrupoCompra();
                    /* 
 */
                    this.getView().getModel().attachRequestCompleted(jQuery.proxy(function (e) {
                        //BEGIN - RJV - TS119 - 11/10/2022
                        //Se comprueba si es nuevo y obtiene la primera posición y se copian las REU y las BP
                        if(e.mParameters.method === "MERGE" && e.mParameters.url.includes("C_PurchaseOrderItemTP")){
                            this.getView().getModel().refresh();
                        }
                        if (e.getParameter("url").indexOf("to_PurchaseOrderItemTP") > -1 && e.getParameter("response").statusCode === '201') {
                            var path = "/C_PurchaseOrderItemTP" + e.getParameter("response").headers.location.split("C_PurchaseOrderItemTP")[1];
                            if (this.getView().getBindingContext()) {
                                this.getView().getModel().read(this.getView().getBindingContext().getPath() + "/to_PurchaseOrderItemTP", {
                                    success: function (data) {
                                        if (data.results.length > 1) {
                                            if (data.results[0].ZZ1_aplicarPosiciones_PDI) {
                                                this.getView().getModel().setProperty(path + "/ZZ1_FLAGBPCliente_PDI", data.results[0].ZZ1_FLAGBPCliente_PDI)
                                                this.getView().getModel().setProperty(path + "/ZZ1_BPCliente_PDI", data.results[0].ZZ1_BPCliente_PDI)
                                                this.getView().getModel().setProperty(path + "/ZZ1_direccionBP_PDI", data.results[0].ZZ1_direccionBP_PDI)
                                                this.getView().getModel().setProperty(path + "/ZZ1_aplicarPosiciones_PDI", data.results[0].ZZ1_aplicarPosiciones_PDI)
                                            }
                                        }
                                    }.bind(this),
                                    error: function () {

                                    }
                                })
                            }
                        }
                        //END - RJV - TS119 - 11/10/2022
                        //BEGIN RJV: ESFU CO120

                        if (this.getView().getBindingContext() && this.getView().getBindingContext().getObject()) {
                            var header = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--template::ObjectPage::ObjectPageHeader");
                            if (window.location.href.indexOf("to_PurchaseOrderItemTP") > -1) {
                                var oTaxonomia = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.inputTaxonomia");
                                if (oTaxonomia && oTaxonomia.getBindingContext() && oTaxonomia.getBindingContext().getObject() && this.getView().getBindingContext().getObject().CompanyCode) {
                                    var sPlant = oTaxonomia.getBindingContext().getObject().Plant;
                                    this._validateAlemania(sPlant);
                                    var oTemplate = new sap.m.ColumnListItem({
                                        cells: [
                                            new sap.m.Text({ text: "{ZCDS_F4_RELTAXGRU_CDS>Taxonomia}" }),
                                            new sap.m.Text({ text: "{ZCDS_F4_RELTAXGRU_CDS>Matkl}" }),
                                        ],
                                    });
                                    var sBukrs = this.getView().getBindingContext().getObject().CompanyCode;
                                    var sBsart = this.getPurchaseOrderInPos();
                                    oTaxonomia.bindSuggestionRows({
                                        path: "ZCDS_F4_RELTAXGRU_CDS>/ZCDS_F4_RELTAXGRU(in_bukrs='" + sBukrs + "',in_bsart='" + sBsart + "',in_Matkl='')/Set",
                                        template: oTemplate,
                                    });
                                }
                                var purchaseType = "";
                                if (header) {
                                    var href = header.getBreadcrumbs().getLinks()[0].getHref();
                                    var pathParent = href.split("/C_PurchaseOrderTP")[1];
                                    purchaseType = this.getView().getModel().getProperty("/C_PurchaseOrderTP" + pathParent + "/PurchaseOrderType");
                                    var sPath = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_EXP_ATOB_PDI-element0");
                                    if (sPath && sPath.getBindingContext()) {
                                        sPath = sPath.getBindingContext().getPath();
                                        var SIMflag = this.getView().getModel().getProperty(sPath + "/ZZ_FLAG_SIM_1");
                                    }
                                }
                                var anexo = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_EXP_ATOB_PDI-element0-cBoxBool");
                                if (anexo) {
                                    anexo.setEnabled(false);
                                }
                                var idDescripcion = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet1::PurchaseOrderItemText::Field-input");
                                // BEGIN REFACTOR TAXONOMIA - RJV - 05/06/2023
                                //Es necesario para, que al modificar la taxonomia, se recargue y traiga el grupo de articulos si hay relación 1:1
                                var idInpTaxonomia = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.inputTaxonomia")
                                
                                if (idDescripcion && idInpTaxonomia) {
                                    idInpTaxonomia.setFieldGroupIds(idDescripcion.mProperties.fieldGroupIds);
                                }
                                // END REFACTOR TAXONOMIA - RJV - 05/06/2023
                                /* BORRAR REFACTOR 
                                var idInpTaxonomia = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_TAXONOMIA2-element0-input");
                                if (idDescripcion && idInpTaxonomia){
                                    idInpTaxonomia.setFieldGroupIds(idDescripcion.mProperties.fieldGroupIds);
                                }
                                */
                                var despliegue = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZDESPLIEGUE_PDI-element0-cBoxBool");
                                if (despliegue) {
                                    despliegue.setEnabled(false);
                                }
                                var periodificable = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_PERIODIFICABLE_PD-element0-cBoxBool");
                                if (periodificable) {
                                    periodificable.setEnabled(false);
                                }
            
                                var taxBenefFlag = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_TAX_BENEF_FLG_PDI");
                                var taxBenefLabel = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_TAX_BENEF_FLG_PDI-element0-label");
                                var taxBenefValue = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_TAX_BENEFIT_VALUE_PDI");
                                var taxBenefValueLabel = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_TAX_BENEFIT_VALUE_PDI-element0-label");
                                if (taxBenefFlag && taxBenefValue) {
                                    var oTaxBenefInputFlag = taxBenefFlag.getFields()[0];
                                    var oValueTaxBenef = taxBenefValue.getFields()[0];
                                    var idDescripcion = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.zs1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet1::PurchaseOrderItemText::Field-input");
                                    if(idDescripcion){
                                        oTaxBenefInputFlag.setFieldGroupIds(idDescripcion.getProperty("fieldGroupIds"));
                                        oValueTaxBenef.setFieldGroupIds(idDescripcion.getProperty("fieldGroupIds"));
                                    }
                                    var aGermanyCodes = ["1156","1176","1269","1270","1275","1470","1834","1837","1841","1845","1850","1885","1886","1887","1923"];
                                    var sCompanyCode = this.getView().getBindingContext().getObject().CompanyCode;
                                    var sPurOrg= this.getView().getBindingContext().getObject().PurchasingOrganization;
                                    if(sCompanyCode && sPurOrg){
                                        if (aGermanyCodes.includes(sCompanyCode) || aGermanyCodes.includes(sPurOrg)) {
                                            taxBenefFlag.setVisible(true);
                                            taxBenefValue.setVisible(true);
                                            taxBenefLabel.setRequired(true);
                                        } else {
                                            taxBenefFlag.setVisible(false);
                                            taxBenefValue.setVisible(false);
                                            taxBenefLabel.setRequired(false);
                                        }
                                    }
                                    var oValueTaxBenefFlag = taxBenefFlag.getFields()[0].getValue() ? taxBenefFlag.getFields()[0].getValue() : "";
                                    if (oValueTaxBenefFlag.includes("SI")) {
                                        taxBenefValueLabel.setRequired(true);
                                    }else{
                                        taxBenefValueLabel.setRequired(false);
                                    }
                                }

                                var referenceNumber = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZ_REFNUMBER_PDI");
                                if (referenceNumber) {
                                    referenceNumber.setVisible(false);
                                }

                                if (purchaseType === "ZOR") {
                                    if (this.getView().getBindingContext().getObject().DraftUUID !== "00000000-0000-0000-0000-000000000000") {
                                        this.editZOR = true;
                                    } else {
                                        this.editZOR = false;
                                    }
                                    var direccionesSelect = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.DireccionesClienteSelect");
                                    var bpFlag = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.AplicaPedidoCheckBox");
                                    var bpFlag2 = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.EntregaCasaCheckBox");
                                    if (direccionesSelect) {
                                        bpFlag.setEnabled(false);
                                        bpFlag2.setEnabled(false);
                                        direccionesSelect.setEnabled(false);
                                        direccionesSelect.setEditable(false);
                                    }
                                    var adjudicacion = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZ_AWARD_PDI");
                                    if (adjudicacion) {
                                        adjudicacion.setVisible(true);
                                        adjudicacion.getFields()[0].setEnabled(false);
                                    }
                                    var fabricante = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZ_FABRICANTE_PDI");
                                    if (fabricante) {
                                        fabricante.setVisible(true);
                                        fabricante.getFields()[0].setEnabled(false);
                                    }

                                    var tarjetasSIM = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.TarjetasSimSection");
                                    if (tarjetasSIM) {
                                        tarjetasSIM.setVisible(false);
                                    }

                                    var aribaDesc = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ1_DESCRIP_ARIBA_PDI");
                                    if (aribaDesc) {
                                        aribaDesc.setVisible(false);
                                    }

                                } else if (purchaseType === "ZDE") {
                                    this.editZOR = false;
                                    var tarjetasSIM = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.TarjetasSimSection");
                                    if (SIMflag) {
                                        if (tarjetasSIM) {
                                            tarjetasSIM.setVisible(true);
                                        }
                                    } else {
                                        tarjetasSIM.setVisible(false);
                                    }

                                    var fabricante = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZ_FABRICANTE_PDI");
                                    var contractMkp = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--SourceOfSupplyFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ1_IDCONTRATOMKP_PO_PDI");

                                    if (contractMkp) {
                                        contractMkp.setVisible(true);
                                    }

                                    if (fabricante) {
                                        fabricante.setVisible(true);
                                        fabricante.getFields()[0].setEnabled(false);
                                    }

                                    var aribaDesc = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ1_DESCRIP_ARIBA_PDI");
                                    if (aribaDesc && header.getBindingContext().getObject().ZZ1_DESCRIP_ARIBA_PDI !== "") {
                                        aribaDesc.setVisible(true);
                                        aribaDesc.getFields()[0].setEnabled(false);
                                    } else {
                                        aribaDesc.setVisible(false);
                                    }

                                    var adjudicacion = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZ_AWARD_PDI");
                                    if (adjudicacion) {
                                        adjudicacion.setVisible(false);
                                    }

                                    var referenceNumber = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZ_REFNUMBER_PDI");
                                    if (referenceNumber) {
                                        referenceNumber.setVisible(true);
                                    }
                                } else {
                                    var tarjetasSIM = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.TarjetasSimSection");
                                    var fabricante = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZ_FABRICANTE_PDI");
                                    var contractMkp = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--SourceOfSupplyFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ1_IDCONTRATOMKP_PO_PDI");

                                    this.editZOR = false;

                                    if (tarjetasSIM) {
                                        tarjetasSIM.setVisible(false);
                                    }

                                    var adjudicacion = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZ_AWARD_PDI");
                                    if (adjudicacion) {
                                        adjudicacion.setVisible(false);
                                    }

                                    if (contractMkp) {
                                        contractMkp.setVisible(false);
                                    }

                                    if (fabricante) {
                                        fabricante.setVisible(false);
                                    }

                                    var aribaDesc = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ1_DESCRIP_ARIBA_PDI");
                                    if (aribaDesc) {
                                        aribaDesc.setVisible(false);
                                    }
                                }

                            } else {
                                if (this.getView().getBindingContext().getObject().PurchaseOrderType === "ZOR") {
                                    var oAddDoc = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--creWitRefBut");
                                    var oRestaurar = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--restoreBut");
                                    var oBorrar = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--deleteBut");
                                    var oCopy = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--ItemsFacet::action::MM_PUR_PO_MAINT_V2_SRV.MM_PUR_PO_MAINT_V2_SRV_Entities::C_PurchaseOrderItemTPCopy_po_item");
                                    if (oAddDoc) {
                                        oAddDoc.setBlocked(true);
                                    }
                                    if (oRestaurar) {
                                        oRestaurar.setBlocked(true);
                                    }
                                    if (oBorrar) {
                                        oBorrar.setBlocked(true);
                                    }
                                    if (oCopy) {
                                        oCopy.setBlocked(true);
                                    }
                                    if (this.getView().getBindingContext().getObject().DraftUUID !== "00000000-0000-0000-0000-000000000000") {
                                        this.editZOR = true;
                                    } else {
                                        this.editZOR = false;
                                    }
                                    //BEGIN RJV: ESFU CO37
                                    var globalidad = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderTPType_ZZ1_ZZ_GLOBAL_H_PDH");
                                    if (globalidad) {
                                        globalidad.setVisible(true);
                                        globalidad.getFields()[0].setEnabled(false);
                                    }
                                    var edicion = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderTPType_ZZ1_ZZ_NUMEDICION_PDH");
                                    if (edicion) {
                                        edicion.setVisible(true);
                                        edicion.getFields()[0].setEnabled(false);
                                    }



                                    //END RJV : ESFU CO37
                                } else {
                                    var oAddDoc = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--creWitRefBut");
                                    var oRestaurar = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--restoreBut");
                                    var oBorrar = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--deleteBut");
                                    var oCopy = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--ItemsFacet::action::MM_PUR_PO_MAINT_V2_SRV.MM_PUR_PO_MAINT_V2_SRV_Entities::C_PurchaseOrderItemTPCopy_po_item");
                                    if (this.getView().getBindingContext().getObject().PurchaseOrderType && this.getView().getBindingContext().getObject().PurchaseOrderType !== "ZOR") {
                                        if (oAddDoc) {
                                            oAddDoc.setBlocked(false);
                                        }
                                        if (oRestaurar) {
                                            oRestaurar.setBlocked(false);
                                        }
                                        if (oBorrar) {
                                            oBorrar.setBlocked(false);
                                        }
                                        if (oCopy) {
                                            oCopy.setBlocked(false);
                                        }
                                    }
                                    //BEGIN RJV: ESFU CO37
                                    var globalidad = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderTPType_ZZ1_ZZ_GLOBAL_H_PDH");
                                    if (globalidad) {
                                        globalidad.setVisible(false);
                                    }
                                    var edicion = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderTPType_ZZ1_ZZ_NUMEDICION_PDH");
                                    if (edicion) {
                                        edicion.setVisible(false);
                                    }

                                    //END RJV : ESFU CO37
                                    this.editZOR = false;
                                    var posTable = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--ItemsFacet::Table");
                                    if (posTable) {
                                        var aColumns = posTable._oPersController.getColumnKeys();
                                        var aVisibleColumns = posTable.getTable().getColumns();
                                        if (aColumns.indexOf("ZZ_TAXONOMIA2") !== -1) {
                                            aColumns.splice(aColumns.indexOf("ZZ_TAXONOMIA2"), 1);
                                            aColumns.splice(aColumns.indexOf("ZZ1_TAXONOMIA2_PDIT"), 1);
                                            posTable._oPersController.mProperties.columnKeys = aColumns;
                                            for (var i = 0; i < aVisibleColumns.length; i++) {
                                                if (aVisibleColumns[i].sId.indexOf("ZZ_PRTAXONOMIA") > -1) {
                                                    aVisibleColumns[i].setVisible(false);
                                                }
                                                if (aVisibleColumns[i].sId.indexOf("ZZ_TAXONOMIA") > -1) {
                                                    aVisibleColumns[i].setVisible(false);
                                                }
                                                if (aVisibleColumns[i].sId.indexOf("ZZ1_PRTAXONOMIA_PRIT") > -1) {
                                                    aVisibleColumns[i].setVisible(false);
                                                }
                                                if (aVisibleColumns[i].sId.indexOf("ZZ1_TAXONOMIA_PRIT") > -1) {
                                                    aVisibleColumns[i].setVisible(false);
                                                }
                                            }
                                        }
                                    }
                                    //BEGIN RJV : ESFU CO124
                                    // Para aplicar filtros en grupo de articulos
                                    // var arrayMaterialGroup = $.find("td[data-sap-ui-column='ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--ItemsFacet::Table-MaterialGroup']")
                                    // for(var i in arrayMaterialGroup){
                                    //     var inputMaterialGroup = arrayMaterialGroup[i].childNodes[0].childNodes[0].childNodes[0];
                                    //     if(sap.ui.getCore().byId(inputMaterialGroup.id) && sap.ui.getCore().byId(inputMaterialGroup.id).getBindingContext() ){
                                    //         var contextObject = sap.ui.getCore().byId(inputMaterialGroup.id).getBindingContext().getObject()
                                    //         var valueHelpDialog = sap.ui.getCore().byId(inputMaterialGroup.id+"-valueHelpDialog");
                                    //         if(valueHelpDialog){
                                    //             var oTable =valueHelpDialog.getTable();
                                    //             this.oFlagTaxo = this.oFlagTaxo === undefined || this.oFlagTaxo === true ? true : this.oFlagTaxo === "Salida" ? false : true;
                                    //             if (this.oFlagTaxo === false) {
                                    //                 this.oFlagTaxo = undefined;
                                    //                 return;
                                    //             }
                                    //                 var a_FilterTaxo = [];

                                    //                 if(oTable.getBinding("rows")){
                                    //                     var oFilterGroup,filtroTax;
                                    //                     if(this.getView().getBindingContext().getObject().PurchaseOrderType === "ZNM"){
                                    //                         filtroTax = this.aResultsTaxZNM;
                                    //                     }else{
                                    //                         filtroTax = this.aResultsTax;
                                    //                     }
                                    //                     //Comprobar si tiene taxonomia. Se comprueba si tenemos la informacion
                                    //                     if(contextObject.ZZ_TAXONOMIA2 === undefined){
                                    //                         this.getView().getModel().read(sap.ui.getCore().byId(inputMaterialGroup.id).getBindingContext().getPath(),{
                                    //                             success:function(data){
                                    //                                 if(data.ZZ_TAXONOMIA2 !== ""){
                                    //                                     this.oFlagTaxo = "Salida"
                                    //                                     filtroTax.forEach(function (line) {
                                    //                                         if(line.Taxonomia === data.ZZ_TAXONOMIA2){
                                    //                                             oFilterGroup = new sap.ui.model.Filter("MaterialGroup", "EQ", line.Matkl);
                                    //                                             a_FilterTaxo.push(oFilterGroup)
                                    //                                         }
                                    //                                     });
                                    //                                     oTable.getBinding("rows").filter(a_FilterTaxo);
                                    //                                 }else{
                                    //                                     this.oFlagTaxo = "Salida"
                                    //                                     filtroTax.forEach(function (line) {
                                    //                                         oFilterGroup = new sap.ui.model.Filter("MaterialGroup", "EQ", line.Matkl);
                                    //                                         a_FilterTaxo.push(oFilterGroup)
                                    //                                     });
                                    //                                     oTable.getBinding("rows").filter(a_FilterTaxo);
                                    //                                 }
                                    //                             }.bind(this),
                                    //                             errror:function(){}
                                    //                         })
                                    //                     }else{
                                    //                         if(contextObject.ZZ_TAXONOMIA2 === ""){
                                    //                             this.oFlagTaxo = "Salida"
                                    //                             filtroTax.forEach(function (line) {
                                    //                                 oFilterGroup = new sap.ui.model.Filter("MaterialGroup", "EQ", line.Matkl);
                                    //                                 a_FilterTaxo.push(oFilterGroup)
                                    //                             });
                                    //                             oTable.getBinding("rows").filter(a_FilterTaxo);
                                    //                         }else{
                                    //                             this.oFlagTaxo = "Salida"
                                    //                             filtroTax.forEach(function (line) {
                                    //                                 if(line.Taxonomia === contextObject.ZZ_TAXONOMIA2){
                                    //                                     oFilterGroup = new sap.ui.model.Filter("MaterialGroup", "EQ", line.Matkl);
                                    //                                     a_FilterTaxo.push(oFilterGroup)
                                    //                                 }
                                    //                             });
                                    //                             oTable.getBinding("rows").filter(a_FilterTaxo);
                                    //                         }
                                    //                     }
                                    //                 }
                                    //         }
                                    //     }
                                    // }

                                    // // Para aplicar filtros en taxonomia
                                    // var tablePos = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--ItemsFacet::responsiveTable");
                                    // for(var i in tablePos.getItems()){
                                    //     //Se recorren las celdas para buscar el de taxonomia
                                    //     var cells = tablePos.getItems()[i].getCells();
                                    //     for(var j in cells){
                                    //         if(cells[j].getEdit().getBindingInfo("value") && cells[j].getEdit().getBindingInfo("value").parts[0]){
                                    //             if(cells[j].getEdit().getBindingInfo("value").parts[0].path === "ZZ_TAXONOMIA2"){
                                    //                 var valueHelpDialog = sap.ui.getCore().byId(cells[j].getEdit().getContent().getId()+"-valueHelpDialog");
                                    //                 if(valueHelpDialog){
                                    //                     var oTable =valueHelpDialog.getTable();                                                      
                                    //                     var localmodel = new sap.ui.model.json.JSONModel();
                                    //                     var oColumnsTaxo = this.getView().getModel("columnasModelTaxo");
                                    //                     var contextObject = cells[j].getEdit().getContent().getBindingContext().getObject()
                                    //                     var a_Data = [];
                                    //                     var filtro;
                                    //                     if(tablePos.getBindingContext().getObject().PurchaseOrderType === "ZNM"){
                                    //                         filtro = this.aResultsTaxZNM;
                                    //                     }else{
                                    //                         filtro = this.aResultsTax;
                                    //                     }
                                    //                     //Se comprueba si esta relleno el grupo de compras
                                    //                     if(contextObject.MaterialGroup !== ""){
                                    //                         filtro.forEach(function (line) {
                                    //                             if(line.Matkl === contextObject.MaterialGroup){
                                    //                                 var obj = {
                                    //                                     Code: line.Taxonomia,
                                    //                                     Description: line.DescTaxonomia
                                    //                                 };
                                    //                                 a_Data.push(obj);
                                    //                             }
                                    //                         });
                                    //                     }else{
                                    //                         filtro.forEach(function (line) {
                                    //                             //Se comprueba duplicidad
                                    //                             var found = false;
                                    //                             for(var i in a_Data){
                                    //                                 if(a_Data[i].Code === line.Taxonomia){
                                    //                                     found = true;
                                    //                                     break;
                                    //                                 }
                                    //                             }
                                    //                             if(!found){
                                    //                                 var obj = {
                                    //                                     Code: line.Taxonomia,
                                    //                                     Description: line.DescTaxonomia
                                    //                                 };
                                    //                                 a_Data.push(obj);
                                    //                             }
                                    //                         });

                                    //                     }
                                    //                     localmodel.setProperty("/ModelTaxonomia", a_Data);
                                    //                     oTable.setModel(localmodel, "Taxo");
                                    //                     oTable.setModel(oColumnsTaxo, "columns");
                                    //                     oTable.bindAggregation("rows", {
                                    //                         path: "Taxo>/ModelTaxonomia"
                                    //                     });
                                    //                 }
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                    // //END RJV :  ESFU CO124


                                }
                                this.setValueInputContrEM();
                                
                                if (this.getView().getBindingContext() && this.getView().getBindingContext().getObject()) {
                                    var sBukrs = this.getView().getBindingContext().getObject().CompanyCode;
                                    var sPurOrg = this.getView().getBindingContext().getObject().PurchasingOrganization;
                                    this._validateAlemaniaHeader(sBukrs,sPurOrg);
                                }
                                this.purchaseGroupRel();
                            }
                            // BEGIN - CO114 - RJV - 22/10/2022
                            this.logicEstadoMKP();
                            // END - CO114 - RJV - 22/10/2022
                            // BEGIN - CO73 - RJV - 22/10/2022
                            this.logicResponsableEM();
                            // END - CO73 - RJV - 22/10/2022
                        }
                        if (this.editZOR) {
                            //Si estamos en cabecera
                            if (window.location.href.indexOf("to_PurchaseOrderItemTP") === -1) {
                                var notesGrid = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--ReuseNotesFacet::SubSection-innerGrid");
                                var icontabNotes = notesGrid.getContent()[0].getContent()[0].getComponentInstance().getRootControl().byId("IconTabBarId")
                                icontabNotes.getItems()[0].getContent()[0].setEnabled(false);
                                icontabNotes.attachSelect(function (oEvent) {
                                    if (oEvent.getParameter("selectedItem").getKey() === 'F20') {
                                        oEvent.getParameter("selectedItem").getContent()[0].setEnabled(true);
                                    } else {
                                        oEvent.getParameter("selectedItem").getContent()[0].setEnabled(false);
                                    }
                                })
                                var smartTableItems = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--ItemsFacet::Table")
                                if (smartTableItems && smartTableItems.getItems()[0].getBindingInfo("items") && smartTableItems.getItems()[0].getItems().length > 0) {
                                    this._tableSetEditable(smartTableItems);
                                }
                                smartTableItems.attachDataReceived(function (oEvent) {
                                    if (oEvent.getSource().getBindingContext() && oEvent.getSource().getBindingContext().getObject().PurchaseOrderType === "ZOR" && oEvent.getSource() && oEvent.getSource().getItems()[0].getBindingInfo("items") && oEvent.getSource().getItems()[0].getItems().length > 0) {
                                        this._tableSetEditable(oEvent.getSource());
                                    }
                                }.bind(this));

                                // var smartTableLimitItems = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--LimitItemsFacet::Table")
                                // smartTableItems.attachDataReceived(function (oEvent) {
                                //     if(this.getView().getBindingContext() && this.getView().getBindingContext().getObject.PurchaseOrderType === "ZOR" && oEvent.getSource() && oEvent.getSource().getItems()[0].getBindingInfo("items") && oEvent.getSource().getItems()[0].getItems().length > 0){
                                //         for(var i = 0; i < oEvent.getSource().getItems()[0].getItems().length; i++){
                                //             for(var y = 0; y < oEvent.getSource().getItems()[0].getItems()[i].getCells().length; y++){
                                //                 oEvent.getSource().getItems()[0].getItems()[i].getCells()[y].setEditable(false)
                                //             }
                                //         }
                                //     }
                                // }.bind(this));
                                // if (smartTableLimitItems && smartTableLimitItems.getItems()[0].getBindingInfo("items")) {
                                //     for(var i = 0; i < smartTableLimitItems.getItems().length; i++){
                                //         for(var y = 0; y < smartTableLimitItems.getItems()[i].getItems()[0].getCells().length; y++){
                                //             smartTableLimitItems.getItems()[i].getItems()[0].getCells()[y].setEditable(false)
                                //         }
                                //     }
                                // }

                                this.setFieldsDisabledZOR();
                                jQuery.sap.delayedCall(3000, this, function () {
                                    var oList = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload")
                                    oList.setMode("SingleSelectLeft");
                                    //Se activa el boton crear fichero
                                    var btnCrearFichero = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload-uploader")
                                    btnCrearFichero.setEnabled(true);
                                    this.getView().byId("customer.zmmpomanages1pa.asignarClasificacion").setEnabled(true);
                                }.bind(this))

                                //Si estamos en la posicion
                            } else {
                                var fieldsInScreen = jQuery.find(".sapUiCompSmartField");
                                var sProductType = this.getView().getBindingContext().getObject().ProductType;
                                fieldsInScreen.forEach(function (e) {
                                    sap.ui.getCore().byId(e.id).setEditable(false);
                                    if (e.id.indexOf("idScheduleLineDeliveryDate") > -1 && sProductType === "1") {
                                        sap.ui.getCore().byId(e.id).setEditable(true);
                                    }

                                    if (e.id.indexOf("idPerformancePeriodStartDate") > -1 && sProductType === "2") {
                                        sap.ui.getCore().byId(e.id).setEditable(true);
                                    }

                                    if (e.id.indexOf("idPerformancePeriodEndDate") > -1 && sProductType === "2") {
                                        sap.ui.getCore().byId(e.id).setEditable(true);
                                    }
                                });
                                var inputInScreen = jQuery.find(".sapMInput");
                                inputInScreen.forEach(function (e) {
                                    if (sap.ui.getCore().byId(e.id)) {
                                        sap.ui.getCore().byId(e.id).setEditable(false);
                                    }
                                });
                                var root = "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--"
                                sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.fechaInicioDate") ? sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.fechaInicioDate").setEnabled(false) : '';
                                sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.fechaFinDate") ? sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.fechaFinDate").setEnabled(false) : '';
                                sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.flagAutoCheckBox") ? sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.flagAutoCheckBox").setEnabled(false) : '';
                                sap.ui.getCore().byId(root + "ReusePricingFacet::SubSection-innerGrid") ? sap.ui.getCore().byId(root + "ReusePricingFacet::SubSection-innerGrid").getContent()[0].getContent()[0].getComponentInstance().getRootControl().byId("addBtn").setEnabled(false) : '';
                                sap.ui.getCore().byId(root + "AccountAssignmentFacet::addEntry") ? sap.ui.getCore().byId(root + "AccountAssignmentFacet::addEntry").setEnabled(false) : '';
                                sap.ui.getCore().byId(root + "AccountAssignmentFacet::deleteEntry") ? sap.ui.getCore().byId(root + "AccountAssignmentFacet::deleteEntry").setEnabled(false) : '';
                                sap.ui.getCore().byId(root + "AccountAssignmentFacet::pasteEntries") ? sap.ui.getCore().byId(root + "AccountAssignmentFacet::pasteEntries").setEnabled(false) : '';
                                if(sap.ui.getCore().byId(root + "ProcessFlowFacet3::IsCompletelyDelivered::Field")){
                                    sap.ui.getCore().byId(root + "ProcessFlowFacet3::IsCompletelyDelivered::Field").setEditable(true);
                                    sap.ui.getCore().byId(root + "ProcessFlowFacet3::IsCompletelyDelivered::Field").setContextEditable(true);
                                }
                                if (sap.ui.getCore().byId(root + "ProcessFlowFacet3::IsFinallyInvoiced::Field")){
                                    sap.ui.getCore().byId(root + "ProcessFlowFacet3::IsFinallyInvoiced::Field").setEditable(true);
                                    sap.ui.getCore().byId(root + "ProcessFlowFacet3::IsFinallyInvoiced::Field").setContextEditable(true);
                                }
                                sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.inputTaxonomia") ? sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.inputTaxonomia").setEnabled(false) : '';
                                var notesGridPos = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--ReuseItemNotesFacet::SubSection-innerGrid");
                                var icontabNotesPos = notesGridPos.getContent()[0].getContent()[0].getComponentInstance().getRootControl().byId("IconTabBarId");
                                //Se bloquea el primer textarea y luego al cambiar de pestañas se bloquea los demás
                                icontabNotesPos.getItems()[0].getContent()[0].setEnabled(false)
                                icontabNotesPos.attachSelect(function (oEvent) {
                                    oEvent.getParameter("selectedItem").getContent()[0].setEnabled(false);
                                })
                            }
                        } else {
                            this.setFieldsEnabledZOR();
                            var oTable = sap.ui.getCore().byId("__xmlview3--priceElementsTable");
                            if (oTable) {
                                oTable.setBlocked(false);
                            }
                            //this.getView().byId("customer.zmmpomanages1pa.asignarClasificacion").setEnabled(false);
                        }
                        //END RJV: ESFU CO120
                        //BEGIN - RJV - TS122 - 11/10/2022
                        // if (window.location.href.indexOf("to_PurchaseOrderItemTP") > -1) {
                        //     //Se comprueba si un pedido periodificable
                        //     if (this.getView().getBindingContext() && this.getView().getBindingContext().getObject()) {
                        //         var objContext = this.getView().getBindingContext().getObject();
                        //         var plant = objContext.Plant;
                        //         var materialGroup = objContext.MaterialGroup;
                        //         if (plant !== "" && plant !== undefined && materialGroup !== "" && materialGroup !== undefined) {

                        //             var sPath = this.getView().getBindingContext().getPath();
                        //             var oModel = this.getView().getModel();
                        //             var date = new Date();
                        //             var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });
                        //             var dateFormatted = dateFormat.format(date);

                        //             this.getView().getModel("odataModelExt").read("/PerioDifSet(ZperStart='" + dateFormatted + "',Bukrs='" + plant + "',Matkl='" + materialGroup + "')", {
                        //                 success: function (data) {
                        //                     oModel.setProperty(sPath + "/ZZ1_ZPER_POS_PDI", data.Status === "" ? false : true);
                        //                 }.bind(this),
                        //                 error: function () { }
                        //             })

                        //         }
                        //     }
                        // }

                        //END - RJV - TS122 - 11/10/2022

                        //BEGIN RJV : Validar imputaciones 28/11/2023
                        if (this.getView().getBindingContext() && this.getView().getBindingContext().getObject()) {
                            if (window.location.href.indexOf("to_PurchaseOrderItemTP") > -1) {
                                var comboboxImp = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::AccountAssignmentCategory::Field-comboBoxEdit")
                                if (comboboxImp) {
                                    if (!comboboxImp.validado) {
                                        comboboxImp.validado = true;
                                        comboboxImp.attachBrowserEvent("click", (oEvent) => {
                                            var bukrs = this.getView().getBindingContext().getObject().CompanyCode;
                                            var bsart = this.getPurchaseOrderInPos();
                                            this.getView().getModel("ZMMPU_0004").read("/MatchcodeTipoImputacionSet", {
                                                filters: [new sap.ui.model.Filter("Bukrs", "EQ", bukrs),
                                                new sap.ui.model.Filter("Bsart", "EQ", bsart)],
                                                success: function (data) {
                                                    var aFilters = []
                                                    for (var i in data.results) {
                                                        aFilters.push(new sap.ui.model.Filter("AccountAssignmentCategory", "EQ", data.results[i].Knttp));
                                                    }
                                                    var filters = new sap.ui.model.Filter({ filters: aFilters, and: false });
                                                    comboboxImp.getBinding("items").filter(filters);
                                                }.bind(this)
                                            });
                                        });
                                    }
                                }
                            }
                        }
                        //END RJV : Validar imputaciones 28/11/2023


                        //BEGIN - RJV - TS119 - 11/10/2022
                        if (window.location.href.indexOf("to_PurchaseOrderItemTP") > -1) {
                            if (this.getView().getBindingContext() && this.getView().getBindingContext().getObject()) {
                                var objContext = this.getView().getBindingContext().getObject();
                                //Se sustituye una section de entrega por una no editable.
                                var oModel = this.getView().getModel("ZMMPU_0002");
                                oModel.setUseBatch(false);
                                if (objContext.ProductType !== undefined && objContext.CompanyCode !== undefined && !this.oBool) {
                                    var oURLParameters = {
                                        "BUKRS": objContext.CompanyCode,
                                        "PRODUCTTYPE": objContext.ProductType
                                    };
                                    this.oBool = true;
                                    oModel.callFunction("/ValidacionDespliegue", {
                                        method: "POST",
                                        urlParameters: oURLParameters,
                                        success: function (oData) {
                                            sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZDESPLIEGUE_PDI").setVisible(oData.despliegue);
                                            sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_PERIODIFICABLE_PD").setVisible(oData.despliegue);
                                        },
                                        error: function (oError) {
                                        }
                                    });
                                }
                                // else{
                                // sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ1_ZZDESPLIEGUE_PDI").setVisible(false);
                                // sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_PERIODIFICABLE_PD").setVisible(false);
                                // }
                                if (objContext.ZZ1_direccionBP_PDI) {
                                    var viewCfg = this.getView().getModel("viewCfg");
                                    var arrayAux = objContext.ZZ1_direccionBP_PDI.split(" / ");
                                    var arrayCodPobl;
                                    if (arrayAux[0]) {
                                        var arrayCalleNumero = arrayAux[0].split(" ");
                                    }
                                    if (arrayAux[1] && arrayAux[1] !== "") {
                                        arrayCodPobl = arrayAux[1].split(" ");
                                    }
                                    if (arrayCalleNumero[arrayCalleNumero.length - 1] === "") {
                                        viewCfg.setProperty("/BP/calle", arrayAux[0].replace(arrayCalleNumero[arrayCalleNumero.length - 2], ""));
                                        viewCfg.setProperty("/BP/numero", arrayCalleNumero[arrayCalleNumero.length - 2])
                                    } else {
                                        viewCfg.setProperty("/BP/calle", arrayAux[0].replace(arrayCalleNumero[arrayCalleNumero.length - 1], ""));
                                        viewCfg.setProperty("/BP/numero", arrayCalleNumero[arrayCalleNumero.length - 1])
                                    }
                                    if (arrayCodPobl) {
                                        viewCfg.setProperty("/BP/codigoPostal", arrayCodPobl[0])
                                        viewCfg.setProperty("/BP/poblacion", arrayAux[1].replace(arrayCodPobl[0], ""));
                                    }
                                    this.getView().byId("customer.zmmpomanages1pa.BpFESection") ? this.getView().byId("customer.zmmpomanages1pa.BpFESection").setVisible(true) : "";
                                    sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--DeliveryAddressCollectionFacet::Section")
                                        ? sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--DeliveryAddressCollectionFacet::Section").setVisible(false) : ""
                                } else {
                                    this.getView().byId("customer.zmmpomanages1pa.BpFESection") ? this.getView().byId("customer.zmmpomanages1pa.BpFESection").setVisible(false) : "";
                                    sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--DeliveryAddressCollectionFacet::Section")
                                        ? sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--DeliveryAddressCollectionFacet::Section").setVisible(true) : ""
                                }
                            }
                        }
                        //END - RJV - TS119 - 11/10/2022
                        //BEGIN RJV: ESFU CO76
                        var sId = "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload";
                        let sId1 = "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload";
                        this.oList = sap.ui.getCore().byId(sId);
                        this.oList1 = sap.ui.getCore().byId(sId1);
                        //En la posicion
                        if (window.location.href.indexOf("to_PurchaseOrderItemTP") > -1) {

                            if (!this.bFlag3) {
                                if (this.oList1) {
                                    this.bFlag3 = true;
                                    this._setDialogForDetail();
                                    this.oList1.getBinding("items").attachChange((oEvent) => {
                                        this._getDocumentsForDetail(oEvent);
                                    });
                                }
                            }
                            this._validateCO94HiddenSourceSupply(purchaseType);
                            //En la cabecera
                        } else {
                            if (this.oList) {
                                if (sId.includes(this.getView().getId()) && !this.bFlag2) {
                                    this.bFlag2 = true;
                                    this._setDialog.bind(this)();
                                    this.oList.getBinding("items").attachChange((oEvent) => {
                                        this._getDocuments(oEvent);
                                    });
                                }
                            }
                        }
                        //END RJV: ESFU CO76
                        //BEGIN JMD: ESFU CO124
                        //En la posicion
                        if (window.location.href.indexOf("to_PurchaseOrderItemTP") > -1) {
                            this.onAfterRenderingTaxonomia();
                        }
                        //END JMD: ESFU CO124

                    }.bind(this), this));

                },


            },
            _tableSetEditable: function (oTable) {
                for (var i = 0; i < oTable.getItems()[0].getItems().length; i++) {
                    for (var y = 0; y < oTable.getItems()[0].getItems()[i].getCells().length; y++) {
                        oTable.getItems()[0].getItems()[i].getCells()[y].setEditable(false)
                    }
                }
            },
            setValueInputContrEM: function () {
                var inputContrEM = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--customer.zmmpomanages1pa.inputContrEM");
                if (inputContrEM && this.getView().getBindingContext().getObject().ZZ1_RESP_EM && this.getView().getBindingContext().getObject().ZZ1_RESP_EM !== "00000000") {
                    if (inputContrEM.getSuggestionRows() && inputContrEM.getSuggestionRows().length > 0) {
                        var found = false;
                        for (var i in inputContrEM.getSuggestionRows()) {
                            if (this.getView().getBindingContext().getObject().ZZ1_RESP_EM === inputContrEM.getSuggestionRows()[i].getBindingContext("odataHelp").getObject().Respymgmtteamid) {
                                found = true;
                                inputContrEM.setValue(inputContrEM.getSuggestionRows()[i].getBindingContext("odataHelp").getObject().Respymgmtglobalteamid);
                                break;
                            }
                        }
                        if (!found) {
                            inputContrEM.setValue("");
                        }
                    } else {
                        inputContrEM.setValue("");
                    }
                } else if (inputContrEM && this.getView().getBindingContext().getObject().ZZ1_RESP_EM === "00000000") {
                    inputContrEM.setValue("");
                }
            },
            //BEGIN RJV: ESFU CO76
            _getDocuments: function (oEvent) {
                let sUrlContext = "/GetAllOriginals";
                let oContext = [], bExists = false, oContextAttribute = {};
                let sParameters = "";
                var oBindingContext = this.oList.getBindingContext();
                sParameters = "ObjectType='BUS2012'&" +
                    "ObjectKey='" + (oBindingContext.getProperty("PurchaseOrder") ? oBindingContext.getProperty("PurchaseOrder") : oBindingContext.getProperty("DraftUUID").replaceAll("-", "")) + "'&" +
                    "SemanticObjectType=''&" +
                    "IsDraft=true";
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                CV_ATTACHMENT_SRV.read(sUrlContext, {
                    urlParameters: sParameters,
                    success: (oResult) => {
                        oContext = this.oList.getModel("__attachmentData").getData();
                        oContext.dataitems.forEach((oItem) => {
                            oResult.results.forEach((oSubItem) => {
                                if (oItem.Documentnumber == oSubItem.Documentnumber && oItem.ApplicationId == oSubItem.ApplicationId) {
                                    bExists = false;
                                    oItem.attributes.forEach((oFile) => {
                                        if (oFile.title === oResourceBundle.getText("tipoClasif")) {
                                            bExists = true;
                                            oContextAttribute = oFile;
                                        }
                                    });
                                    if (bExists) {
                                        oContextAttribute.text = oSubItem.Storagecategory === "Externo" ? oResourceBundle.getText("externo") : oResourceBundle.getText("interno");
                                        oItem.attributes.splice(4, 1, oContextAttribute);
                                    } else {
                                        if(oSubItem.Storagecategory === "Externo"){
                                            oItem.attributes.push({
                                                text: oResourceBundle.getText("externo"),
                                                title: oResourceBundle.getText("tipoClasif"),
                                                visible: true
                                            });
                                        }else if(oSubItem.Storagecategory === "Interno"){
                                            oItem.attributes.push({
                                                text: oResourceBundle.getText("interno"),
                                                title: oResourceBundle.getText("tipoClasif"),
                                                visible: true
                                            });
                                        }
                                    }
                                }
                            });
                        });
                        this.oList.getModel("__attachmentData").setData({
                            dataitems: oContext.dataitems
                        });
                        for(var i = 0; i < this.oList.getItems().length; i++){
                            this.oList.getItems()[i].setVisibleRemove(true);
                            this.oList.getItems()[i].setEnabledRemove(true);
                        }
                        this.oList.setMode("SingleSelectLeft");
                    }
                });
            },
            _getDocumentsForDetail: function (oEvent) {
                var oBindingContext = this.oList1.getBindingContext();
                let sUrlContext = "/GetAllOriginals";
                let oContext = [], bExists = false, oContextAttribute = {};
                let sParameters = "";
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                sParameters = "ObjectType='EKPO'&" +
                    "ObjectKey='" + (oBindingContext.getProperty("PurchaseOrder") ? oBindingContext.getProperty("PurchaseOrder") + oBindingContext.getProperty("PurchaseOrderItem") : oBindingContext.getProperty("DraftUUID").replaceAll("-", "")) + "'&" +
                    "SemanticObjectType=''&" +
                    "IsDraft=true";
                    CV_ATTACHMENT_SRV.read(sUrlContext, {
                    urlParameters: sParameters,
                    success: (oResult) => {
                        oContext = this.oList1.getModel("__attachmentData").getData();
                        oContext.dataitems.forEach((oItem) => {
                            oResult.results.forEach((oSubItem) => {
                                if (oItem.FileId == oSubItem.FileId && oItem.ApplicationId == oSubItem.ApplicationId) {
                                    bExists = false;
                                    oItem.attributes.forEach((oFile) => {
                                        if (oFile.title === oResourceBundle.getText("tipoClasif")) {
                                            bExists = true;
                                            oContextAttribute = oFile;
                                        }
                                    });
                                    if (bExists) {
                                        oContextAttribute.text = oSubItem.Storagecategory === "Externo" ? oResourceBundle.getText("externo") : oResourceBundle.getText("interno");
                                        oItem.attributes.splice(4, 1, oContextAttribute);
                                    } else {
                                        if(oSubItem.Storagecategory === "Externo"){
                                            oItem.attributes.push({
                                                text: oResourceBundle.getText("externo"),
                                                title: oResourceBundle.getText("tipoClasif"),
                                                visible: true
                                            });
                                        }else if(oSubItem.Storagecategory === "Interno"){
                                            oItem.attributes.push({
                                                text: oResourceBundle.getText("interno"),
                                                title: oResourceBundle.getText("tipoClasif"),
                                                visible: true
                                            });
                                        }
                                    }
                                }
                            });
                        });
                        this.oList1.getModel("__attachmentData").setData({
                            dataitems: oContext.dataitems
                        });
                    }
                });
            },
            _setDialog: function (oEvent) {
                let sOrigin = "";
                if(this.getView().getModel("JSON_MDL")){
                    var bEnter = this.getView().getModel("JSON_MDL").getProperty("/Enter");
                    if (bEnter) {
                        return;
                    } else {
                        this.getView().getModel("JSON_MDL").setProperty("/Enter", true)
                    }
                    this.oDialog = new sap.m.Dialog({
                        title: "{i18n>asignarClasificacion}",
                        content: [
                            new sap.m.VBox({
                                items: [
                                    new sap.m.RadioButton({
                                        text: "{i18n>interno}",
                                        selected: "{JSON_MDL>/Type/TypeI}",
                                        enabled: "{JSON_MDL>/Type/Flag}"
                                    }),
                                    new sap.m.RadioButton({
                                        text: "{i18n>externo}",
                                        selected: "{JSON_MDL>/Type/TypeE}",
                                        enabled: "{JSON_MDL>/Type/Flag}"
                                    })
                                ]
                            })
                        ],
                        buttons: [
                            new sap.m.Button({
                                text: "{i18n>guardar}",
                                press: (oEvt) => {
                                    this._saveClasification(oEvt, this.oDialog);
                                }
                            })
                        ],
                        beforeOpen: () => {
                            sOrigin = this.getView().getModel("JSON_MDL").getProperty("/Origin");
                            var oBindingContext = this.oList.getBindingContext();
                            if (sOrigin == "Upload") {
                                return;
                            }
                            var sUrl = "/TipoAnexosI_ESet(Zzsociedad='" + oBindingContext.getProperty("CompanyCode") +
                                "',ZztipoDoc='F" +
                                "',ZzclaseDoc='" + oBindingContext.getProperty("PurchaseOrderType") +
                                "',ZzOrgComp='',ZzDocumento='')";
                                ZMM_CO_SRV.read(sUrl, {
                                success: (oResult) => {
                                    if (oResult.ZzindExIn == "I" || oResult.ZzindExIn == "E") {
                                        oResult.TypeI = false;
                                        oResult.TypeE = false;
                                        if (oResult.ZzindExIn == "I") {
                                            oResult.TypeI = true;
                                        } else if (oResult.ZzindExIn == "E") {
                                            oResult.TypeE = true;
                                        }
                                        this.getView().getModel("JSON_MDL").setProperty("/Type", oResult);
                                        oResult.Flag = false;
                                    } else {
                                        this.getView().getModel("JSON_MDL").setProperty("/Type", oResult);
                                        oResult.Flag = true;
                                    }
                                    this.oDialog.open();
                                },
                                error: (oError) => {
                                    sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                    this.oDialog.close();
                                }
                            });
                        },
                        escapeHandler: function (oPromise) {
                            oPromise.reject();
                        }
                    });
                    if (!bEnter) {
                        this.getView().addDependent(this.oDialog);
                        this.oDialog.addStyleClass("sapUiContentPadding");
                    }
                    if(this.oList.mEventRegistry.uploadCompleted.length <= 1){
                        this.oList.attachUploadCompleted((oEvt) => {
                            var oBindingContext = this.oList.getBindingContext();
                            let DocNumber = null;
                            if (oEvt.getParameter("status") == 201) {
                                this.getView().getModel("JSON_MDL").setProperty("/Origin", "Upload");
                                if (oEvt.getParameter("item")) {
                                    DocNumber = JSON.parse(oEvt.getParameters("response").response).d.Documentnumber;
                                    this.getView().getModel("JSON_MDL").setProperty("/DocNumber", DocNumber);
                                }
                                var sUrl = "/TipoAnexosI_ESet(Zzsociedad='" + oBindingContext.getProperty("CompanyCode") +
                                    "',ZztipoDoc='F" +
                                    "',ZzclaseDoc='" + oBindingContext.getProperty("PurchaseOrderType") +
                                    "',ZzOrgComp='" + oBindingContext.getProperty("PurchasingOrganization") +
                                    "',ZzDocumento='" + oBindingContext.getProperty("PurchaseOrder") + "')";
                                    ZMM_CO_SRV.read(sUrl, {
                                    success: (oResult) => {
                                        if (oResult.ZzindExIn == "I" || oResult.ZzindExIn == "E") {
                                            oResult.TypeI = false;
                                            oResult.TypeE = false;
                                            if (oResult.ZzindExIn == "I") {
                                                oResult.TypeI = true;
                                            } else if (oResult.ZzindExIn == "E") {
                                                oResult.TypeE = true;
                                            }
                                            oResult.Flag = false;
                                            this.getView().getModel("JSON_MDL").setProperty("/Type", oResult);
                                            this._saveClasification();
                                        } else {
                                            oResult.Flag = true;
                                            this.getView().getModel("JSON_MDL").setProperty("/Type", oResult);
                                            this.oDialog.open();
                                        }
                                    },
                                    error: (oError) => {
                                        sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                        this.oDialog.close();
                                    }
                                });
                            }
                        });
                    }
                }
            },
            //BEGIN - OBR - CO39 - 09/02/2023
            setOnlyNumeric: function (oEvent) {
                var sNumber = "";
                var value = oEvent.getSource().getValue();
                var bNotnumber = isNaN(value);
                if (bNotnumber == false) sNumber = value;
                else oEvent.getSource().setValue(sNumber);
            },
            //END - OBR - CO39 - 09/02/2023

            _setDialogForDetail: function (oEvent) {
                var sUrl1 = "", sOrigin = "";
                if(this.getView().getModel("JSON_MDL")){
                    
                var bEnter1 = this.getView().getModel("JSON_MDL").getProperty("/Enter1");
                if (bEnter1) {
                    return;
                } else {
                    this.getView().getModel("JSON_MDL").setProperty("/Enter1", true)
                }
                this.oDialog1 = new sap.m.Dialog({
                    title: "{i18n>asignarClasificacion}",
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.RadioButton({
                                    text: "{i18n>interno}",
                                    selected: "{JSON_MDL>/Type1/TypeI}",
                                    enabled: "{JSON_MDL>/Type1/Flag}"
                                }),
                                new sap.m.RadioButton({
                                    text: "{i18n>externo}",
                                    selected: "{JSON_MDL>/Type1/TypeE}",
                                    enabled: "{JSON_MDL>/Type1/Flag}"
                                })
                            ]
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>guardar}",
                            press: (oEvt) => {
                                this._saveClasificationForDetail(oEvt, this.oDialog1);
                            }
                        })
                    ],
                    beforeOpen: () => {
                        sOrigin = this.getView().getModel("JSON_MDL").getProperty("/Origin");
                        var oBindingContext1 = this.oList1.getBindingContext();
                        sUrl1 = oBindingContext1.getPath() + "/to_PurchaseOrderTP";
                        if (sOrigin == "Upload") {
                            return;
                        }
                        this.getView().getModel().read(sUrl1, {
                            success: (oHeader) => {
                                if (!oHeader.PurchaseOrder) {
                                    oHeader.PurchaseOrder = "";
                                }
                                sUrl1 = "/TipoAnexosI_ESet(Zzsociedad='" + oHeader.CompanyCode +
                                    "',ZztipoDoc='F" +
                                    "',ZzclaseDoc='" + oHeader.PurchaseOrderType +
                                    "',ZzOrgComp='" + oHeader.PurchasingOrganization +
                                    "',ZzDocumento='" + oHeader.PurchaseOrder + "')";
                                    ZMM_CO_SRV.read(sUrl1, {
                                    success: (oResult) => {
                                        if (oResult.ZzindExIn == "I" || oResult.ZzindExIn == "E") {
                                            oResult.TypeI = false;
                                            oResult.TypeE = false;
                                            if (oResult.ZzindExIn == "I") {
                                                oResult.TypeI = true;
                                            } else if (oResult.ZzindExIn == "E") {
                                                oResult.TypeE = true;
                                            }
                                            oResult.Flag = false;
                                        } else {
                                            oResult.Flag = true;
                                            this.oDialog1.open();
                                        }
                                        this.getView().getModel("JSON_MDL").setProperty("/Type1", oResult);
                                    },
                                    error: (oError) => {
                                        sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                        this.oDialog1.close();
                                    }
                                });
                            },
                            error: (oError) => {
                                sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                this.oDialog1.close();
                            }
                        });
                    },
                    escapeHandler: function (oPromise) {
                        oPromise.reject();
                    }
                });
                this.getView().addDependent(this.oDialog1);
                this.oDialog1.addStyleClass("sapUiContentPadding");
                this.oList1.getToolbar().getContent().forEach((oItem) => {
                    if (oItem instanceof sap.m.Button) {
                        this.bFlag1 = true;
                    }
                });
                if(this.oList1.mEventRegistry.uploadCompleted.length <= 1){
                    this.oList1.attachUploadCompleted((oEvt) => {
                        let DocNumber = null;
                        if (oEvt.getParameter("status") == 201) {
                            this.getView().getModel("JSON_MDL").setProperty("/Origin", "Upload");
                            if (oEvt.getParameter("item")) {
                                DocNumber = JSON.parse(oEvt.getParameters("response").response).d.FileId;
                                this.getView().getModel("JSON_MDL").setProperty("/DocNumber", DocNumber);
                            }
                            var oBindingContext1 = this.oList1.getBindingContext();
                            sUrl1 = oBindingContext1.getPath() + "/to_PurchaseOrderTP";
                            this.getView().getModel().read(sUrl1, {
                                success: (oHeader) => {
                                    if (!oHeader.PurchaseOrder) {
                                        oHeader.PurchaseOrder = "";
                                    }
                                    sUrl1 = "/TipoAnexosI_ESet(Zzsociedad='" + oHeader.CompanyCode +
                                        "',ZztipoDoc='F" +
                                        "',ZzclaseDoc='" + oHeader.PurchaseOrderType +
                                        "',ZzOrgComp='" + oHeader.PurchasingOrganization +
                                        "',ZzDocumento='" + oHeader.PurchaseOrder + "')";
                                        ZMM_CO_SRV.read(sUrl1, {
                                        success: (oResult) => {
                                            if (oResult.ZzindExIn == "I" || oResult.ZzindExIn == "E") {
                                                oResult.TypeI = false;
                                                oResult.TypeE = false;
                                                if (oResult.ZzindExIn == "I") {
                                                    oResult.TypeI = true;
                                                } else if (oResult.ZzindExIn == "E") {
                                                    oResult.TypeE = true;
                                                }
                                                oResult.Flag = false;
                                                this.getView().getModel("JSON_MDL").setProperty("/Type1", oResult);
                                                this._saveClasificationForDetail();
                                            } else {
                                                oResult.Flag = true;
                                                this.getView().getModel("JSON_MDL").setProperty("/Type1", oResult);
                                                this.oDialog1.open();
                                            }
                                        },
                                        error: (oError) => {
                                            sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                            this.oDialog1.close();
                                        }
                                    });
                                },
                                error: () => {
                                    this.oDialog1.close();
                                }
                            });
                        }
                    });
                }
            }
            },
            _saveClasification: function (oEvent) {
                if(this.getView().getModel("JSON_MDL")){
                let oContextItem = null;
                let sDocumentnumber = this.getView().getModel("JSON_MDL").getProperty("/DocNumber");
                let oContextDialog = null;
                let sOrigin = this.getView().getModel("JSON_MDL").getProperty("/Origin");
                let sUrl = "";
                let oEntry = {};
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                oContextDialog = this.getView().getModel("JSON_MDL").getProperty("/Type");
                oContextItem = this.oList.getSelectedItem() ? this.oList.getSelectedItem()[0].getBindingContext("__attachmentData").getObject() : null;
                sUrl = "/DocumentClasifSet";
                if (!oContextDialog.TypeI && !oContextDialog.TypeE) {
                    sap.m.MessageToast.show(oResourceBundle.getText("seleccionarClasificacion"));
                    return;
                }
                if (sOrigin === "Upload") {
                    oEntry.Documentnumber = sDocumentnumber;
                    oEntry.Clasificacion = oContextDialog.TypeI ? "I" : oContextDialog.TypeE ? "E" : null;
                } else {
                    if (!oContextItem) {
                        sap.m.MessageToast.show(oResourceBundle.getText("seleccionarAdjunto"));
                    }
                    oEntry.Documentnumber = oContextItem.Documentnumber;
                    oEntry.Clasificacion = oContextDialog.TypeI ? "I" : oContextDialog.TypeE ? "E" : null;
                }
                sap.ui.core.BusyIndicator.show(0);
                ZMM_ATTACHMENT_CLASIF_SRV.create(sUrl, oEntry, {
                    success: (oResult) => {
                        sap.ui.core.BusyIndicator.hide();
                        this._getDocuments(null);
                        sap.m.MessageToast.show(oResourceBundle.getText("clasifAsignada"));
                        this.getView().getModel("JSON_MDL").setProperty("/Origin", undefined);

                        this.oDialog.close();
                        jQuery.sap.delayedCall(2000, this, function () {
                            //Se activa el boton crear fichero
                            var btnCrearFichero = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload-uploader")
                            btnCrearFichero.setEnabled(true);
                        })
                    },
                    error: () => {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            }
            },
            _saveClasificationForDetail: function (oEvent) {
                if(this.getView().getModel("JSON_MDL")){
                let oContextItem = null;
                let sDocumentnumber = this.getView().getModel("JSON_MDL").getProperty("/DocNumber");
                let oContextDialog = null;
                let sOrigin = this.getView().getModel("JSON_MDL").getProperty("/Origin");
                let sUrl = "";
                let oEntry = {};
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                oContextDialog = this.getView().getModel("JSON_MDL").getProperty("/Type1");
                oContextItem = this.oList1.getSelectedItem() ? this.oList1.getSelectedItem().getBindingContext("__attachmentData").getObject() : null;
                sUrl = "/DocumentClasifPosicionesSet";
                if (!oContextDialog.TypeI && !oContextDialog.TypeE) {
                    sap.m.MessageToast.show(oResourceBundle.getText("seleccionarClasificacion"));
                    return;
                }
                if (sOrigin === "Upload") {
                    oEntry.FileId = sDocumentnumber;
                    oEntry.Clasificacion = oContextDialog.TypeI ? "I" : oContextDialog.TypeE ? "E" : null;
                } else {
                    if (!oContextItem) {
                        sap.m.MessageToast.show(oResourceBundle.getText("seleccionarAdjunto"));
                    }
                    oEntry.FileId = oContextItem.FileId;
                    oEntry.Clasificacion = oContextDialog.TypeI ? "I" : oContextDialog.TypeE ? "E" : null;
                }
                sap.ui.core.BusyIndicator.show(0);
                ZMM_ATTACHMENT_CLASIF_SRV.create(sUrl, oEntry, {
                    success: (oResult) => {
                        sap.ui.core.BusyIndicator.hide();
                        this._getDocumentsForDetail(null);
                        sap.m.MessageToast.show(oResourceBundle.getText("clasifAsignada"));
                        this.oDialog1.close();
                    },
                    error: () => {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            }
            },
            //END RJV: ESFU CO76
            getServiceSociedadGrupoCompra: function () {
                var that = this;
                var ZCDS_REL_SOC_GRUPCOMPR_CDS = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCDS_REL_SOC_GRUPCOMPR_CDS/");
                ZCDS_REL_SOC_GRUPCOMPR_CDS.read("/ZCDS_REL_SOC_GRUPCOMPR", {
                    async: "false",
                    success: function (res) {
                        that.modelSociedadGrupoCompra = new sap.ui.model.json.JSONModel(res.results);
                    },
                    error: function (ores) {
                    }
                });
            },
            // BEGIN - CO73 - RJV - 22/10/2022
            logicResponsableEM: function (e) {
                var sFormResponsab = "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--customer.zmmpomanages1pa.inputContrEM";
                var sociedad = this.getView().getBindingContext().getObject().CompanyCode;
                if (sociedad !== "" && sociedad !== undefined) {
                    this.getView().getModel("odataHelp").read("/SocValSet('" + sociedad + "')", {
                        success: function (data) {
                            sap.ui.getCore().byId(sFormResponsab)?.setVisible(data.Flag === "X" ? true : false);
                        },
                        error: function () {
                            sap.ui.getCore().byId(sFormResponsab)?.setVisible(false);
                        }
                    })
                } else {
                    sap.ui.getCore().byId(sFormResponsab)?.setVisible(false);
                }
            },
            // END - CO73 - RJV - 22/10/2022
            // BEGIN - CO114 - RJV - 22/10/2022
            logicEstadoMKP: function (e) {

                //Logica si estamos en las posiciones
                if (window.location.href.indexOf("to_PurchaseOrderItemTP") > -1) {
                    var idPosFormEstadoMKP = sap.ui.getCore().byId(
                        "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderItemTPType_ZZ1_POS_STATE_INTMKP_PDI"
                    );

                    var sPosEstadoMarket = idPosFormEstadoMKP.getFields()[0];

                    if (idPosFormEstadoMKP) {
                        idPosFormEstadoMKP?.setEditMode(false);
                    }

                    if (idPosFormEstadoMKP) {
                        let oAggregationMKP = idPosFormEstadoMKP.getAggregation("fields").length;

                        if (sPosEstadoMarket) {
                            let sEstadoMKP = sPosEstadoMarket.getValue ? sPosEstadoMarket.getValue() : sPosEstadoMarket.getText();
                            if (sEstadoMKP !== null && sEstadoMKP !== undefined) {
                                let oDescriptionMKP = this.allStateMarketPlace(sEstadoMKP);
                                let sIdDescriptionM = sap.ui.getCore().byId("txtPosDescripMKP");

                                sPosEstadoMarket?.setWidth("4rem");
                                if (oAggregationMKP < 2) {
                                    idPosFormEstadoMKP.addField(
                                        new sap.m.Text({ id: "txtPosDescripMKP", text: oDescriptionMKP })
                                    );
                                }
                                if (sIdDescriptionM) {
                                    sIdDescriptionM.setText(oDescriptionMKP);
                                }
                            }
                        }
                    }
                    //Logica si estamos en las cabecera      
                } else {
                    var idFormEstadoMKP = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet3::FormGroup_C_PurchaseOrderTPType_ZZ_STATE_IS4MKP");


                    if (idFormEstadoMKP) {
                        var sEstadoMarket = idFormEstadoMKP.getFields()[0];
                        idFormEstadoMKP?.setEditMode(false);
                        let oAggregationMKP = idFormEstadoMKP.getAggregation("fields").length;

                        if (sEstadoMarket) {
                            let sEstadoMKP = sEstadoMarket.getValue ? sEstadoMarket.getValue() : sEstadoMarket.getText();
                            let oDescriptionMKP = this.allStateMarketPlace(sEstadoMKP);
                            let sIdDescriptionM = sap.ui.getCore().byId("txtDescripMKP");

                            sEstadoMarket?.setWidth("4rem");
                            if (oAggregationMKP < 2) {
                                idFormEstadoMKP.addField(
                                    new sap.m.Text({ id: "txtDescripMKP", text: oDescriptionMKP })
                                );
                            }
                            if (sIdDescriptionM) {
                                sIdDescriptionM.setText(oDescriptionMKP);
                            }
                        }
                    }
                    //Se pone no editar a las posiciones en el detalle de la cabecera
                    let sIdtblPO = "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--ItemsFacet::responsiveTable";
                    if (sap.ui.getCore().byId(sIdtblPO)) {
                        sap.ui.getCore().byId(sIdtblPO)?.getItems().forEach(function (oItems, iItems) {
                            $.each(oItems.getCells(), function (iCells, oCells) {
                                let sId = oCells.getId();
                                if (oCells.getDisplay().getBindingInfo("text") && oCells.getDisplay().getBindingInfo("text").parts[0].path === "ZZ1_POS_STATE_INTMKP_PDI") {
                                    sap.ui.getCore().byId(sId)?.setEditable(false);
                                }
                                if (oCells.getDisplay().getBindingInfo("text") && oCells.getDisplay().getBindingInfo("text").parts[0].path === "MaterialGroup") {
                                    sap.ui.getCore().byId(sId)?.setEditable(false);
                                }
                            });
                        });
                    }
                }


                /*
                //var sIdGrupoCompra = "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet2::PurchasingGroup::Field-input";
                //var sIdSociedad = "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet2::CompanyCode::Field-";
                //var tblGrupoCompra = sap.ui.getCore().byId(sIdGrupoCompra + "-valueHelpDialog-table");
                //var tblSociedad = sap.ui.getCore().byId(sIdSociedad + "-valueHelpDialog-table");
        
                if (that.oSelectGroupCompra === undefined) {
                  sap.ui.getCore().byId(sIdGrupoCompra)?.attachValueHelpRequest(function(oVhdRequest) {
                    that.oSelectGroupCompra = true;
                  });
                }
            
                if (that.oSelectGroupCompra === undefined) {
                  sap.ui.getCore().byId(sIdGrupoCompra + "-valueHelpDialog-smartFilterBar")?.attachSearch(function(oFilter) {
                    that.oSelectGroupCompra = true;
                  });
                }
            
                if (that.oSelectedSociedad === undefined) {
                  sap.ui.getCore().byId(sIdSociedad)?.attachValueHelpRequest(function(oVhdRequest) {
                    that.oSelectedSociedad = true;
                  });
                }
            
                if (that.oSelectedSociedad === undefined) {
                  sap.ui.getCore().byId(sIdSociedad + "-valueHelpDialog-smartFilterBar")?.attachSearch(function(oFilter) {
                    that.oSelectedSociedad = true;
                  });
                }
            
                //LÓGICA PARA CUANDO SE EJECUTE GRUPO DE COMPRA
                var tableGrupoCompra = sap.ui.getCore().byId(
                  "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet2::PurchasingGroup::Field-input-valueHelpDialog-table"
                );
            
                // var inpSociedad = sap.ui.getCore().byId(sIdSociedad + "input")?.getValue().includes("(") ? sap.ui.getCore().byId(sIdSociedad + "input")?.getValue().split(
                //  "(")[1].slice(0, -1) : sap.ui.getCore().byId(sIdSociedad + "input")?.getValue();
                var inpSociedadValue = sap.ui.getCore().byId(sIdSociedad + "input") ? sap.ui.getCore().byId(sIdSociedad + "input")?.getValue() : sap.ui.getCore().byId(sIdSociedad + "text") ? sap.ui.getCore().byId(sIdSociedad + "text").getText() : "";
                var inpSociedad = inpSociedadValue.includes("(") ? inpSociedadValue.split(
                  "(")[1].slice(0, -1) : inpSociedadValue;
                if (inpSociedad !== "" || inpSociedad !== undefined) {
                  var oGrupoCompra = that.modelSociedadGrupoCompra.getData().filter(e => e.Zzsociedad === inpSociedad);
                  var aFilterSociedad = [];
                  oGrupoCompra.forEach(function(oLine) {
                    aFilterSociedad.push(new sap.ui.model.Filter("PurchasingGroup", "EQ", oLine.Zzgc));
                  });
                  if (inpSociedad !== undefined && inpSociedad !== "" && tableGrupoCompra !== undefined && that.oSelectGroupCompra) {
                    tableGrupoCompra.getBinding("rows").filter(aFilterSociedad);
                    that.oSelectGroupCompra = undefined;
                  }
                  if(inpSociedad === "0156" || inpSociedad === "0026"){
                    sap.ui.getCore().byId(sFormResponsab)?.setVisible(true);
                  } else {
                    sap.ui.getCore().byId(sFormResponsab)?.setVisible(false);
                  }
                }
                //LÓGICA PARA CUANDO SE EJECUTE SOCIEDAD
                var tableSociedad = sap.ui.getCore().byId(
                  "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet2::CompanyCode::Field-input-valueHelpDialog-table"
                );
                var inpGrupoCompra = sap.ui.getCore().byId(sIdGrupoCompra)?.getValue().includes("(") ? sap.ui.getCore().byId(sIdGrupoCompra)?.getValue()
                  .split("(")[1].slice(0, -1) : sap.ui.getCore().byId(sIdGrupoCompra)?.getValue();
                if (inpGrupoCompra !== "" || inpGrupoCompra !== undefined) {
                  var oGrupoCompra = that.modelSociedadGrupoCompra.getData().filter(e => e.Zzgc === inpGrupoCompra);
                  var aFilterGrupoCompra = [];
                  oGrupoCompra.forEach(function(oLine) {
                    aFilterGrupoCompra.push(new sap.ui.model.Filter("CompanyCode", "EQ", oLine.Zzsociedad))
                  });
                  if (inpGrupoCompra !== undefined && inpGrupoCompra !== "" && tableSociedad !== undefined && that.oSelectedSociedad) {
                    tableSociedad.getBinding("rows").filter(aFilterGrupoCompra);
                    that.oSelectedSociedad = undefined;
                  }
                }
            */

            },
            allStateMarketPlace: function (state) {
                let statusMKP = "";
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                if (state) {
                    if (state.includes("00") || state === "") {
                        statusMKP = "00";
                    } else if (state.includes("01")) {
                        statusMKP = "01";
                    } else if (state.includes("02")) {
                        statusMKP = "02";
                    } else if (state.includes("03")) {
                        statusMKP = "03";
                    } else if (state.includes("04")) {
                        statusMKP = "04";
                    } else if (state.includes("05")) {
                        statusMKP = "05";
                    } else if (state.includes("06")) {
                        statusMKP = "06";
                    } else if (state.includes("07")) {
                        statusMKP = "07";
                    } else if (state.includes("08")) {
                        statusMKP = "08";
                    } else if (state.includes("09")) {
                        statusMKP = "09";
                    } else if (state.includes("10")) {
                        statusMKP = "10";
                    } else if (state.includes("11")) {
                        statusMKP = "11";
                    } else if (state.includes("12")) {
                        statusMKP = "12";
                    } else if (state.includes("13")) {
                        statusMKP = "13";
                    } else if (state.includes("14")) {
                        statusMKP = "14";
                    } else if (state.includes("15")) {
                        statusMKP = "15";
                    } else {
                        statusMKP = "16";
                    }

                    switch (statusMKP) {
                        case "00":
                            statusMKP = "-";
                            break;
                        case "01":
                            statusMKP = oResourceBundle.getText("enviadoMKP");
                            break;
                        case "02":
                            statusMKP = oResourceBundle.getText("recibidoMKP");
                            break;
                        case "03":
                            statusMKP = oResourceBundle.getText("modificadoMKP");
                            break;
                        case "04":
                            statusMKP = oResourceBundle.getText("aceptadoMKP");
                            break;
                        case "05":
                            statusMKP = oResourceBundle.getText("totalmenteExp");
                            break;
                        case "06":
                            statusMKP = oResourceBundle.getText("parcialmenteExp");
                            break;
                        case "07":
                            statusMKP = oResourceBundle.getText("emTotal");
                            break;
                        case "08":
                            statusMKP = oResourceBundle.getText("emParcial");
                            break;
                        case "09":
                            statusMKP = oResourceBundle.getText("cancelado");
                            break;
                        case "10":
                            statusMKP = oResourceBundle.getText("errorEnviarPedido");
                            break;
                        case "11":
                            statusMKP = oResourceBundle.getText("errorACK");
                            break;
                        case "12":
                            statusMKP = oResourceBundle.getText("errorAceptacionMKP");
                            break;
                        case "13":
                            statusMKP = oResourceBundle.getText("errorExpMKP");
                            break;
                        case "14":
                            statusMKP = oResourceBundle.getText("errorExpS4");
                            break;
                        case "15":
                            statusMKP = oResourceBundle.getText("errorEntradaS4");
                            break;
                        case "16":
                            statusMKP = oResourceBundle.getText("errorCancelar");
                            break;
                    }
                    return statusMKP;
                }
            },
            // END - CO114 - RJV - 22/10/2022
            //BEGIN - TS119 - RJV
            onValueRequestBPC: function (oEvent) {
                if (!this.oSelectDialog) {
                    this.oSelectDialog = new sap.m.SelectDialog();
                    this.oSelectDialog.data("input", oEvent.getSource());
                    this.oSelectDialog.attachSearch(this.searchBPC.bind(this));
                    this.oSelectDialog.bindAggregation("items", {
                        path: "odataHelp>/PartnerDescSet",
                        template: new sap.m.StandardListItem(
                            {
                                title: "{odataHelp>Partner}",
                                description: "{odataHelp>NameOrg1}"
                            }
                        )
                    }
                    )
                    this.getView().addDependent(this.oSelectDialog);
                    this.oSelectDialog.attachConfirm(this.confirmBPC.bind(this));
                    this.oSelectDialog.attachCancel(this.cancelBPC.bind(this));
                }

                this.oSelectDialog.open();
            },
            searchBPC: function (oEvent) {
                var aFilter = [];
                if (oEvent.getParameter("value")) {
                    aFilter.push(new sap.ui.model.Filter("Partner", "Contains", oEvent.getParameter("value")));
                    aFilter.push(new sap.ui.model.Filter("NameOrg1", "Contains", oEvent.getParameter("value")));
                }
                this.oSelectDialog.getBinding("items").filter(aFilter)
            },
            confirmBPC: function (oEvent) {
                oEvent.getSource().getBinding("items").filter([]);
                this.oSelectDialog.data("input").setValue(oEvent.getParameter("selectedItem").getTitle());
                var direccionesClienteSelect = this.getView().byId("customer.zmmpomanages1pa.DireccionesClienteSelect");
                direccionesClienteSelect.bindAggregation("items", {
                    path: "odataHelp>/CountryDescSet",
                    filters: [new sap.ui.model.Filter("Partner", "EQ", oEvent.getParameter("selectedItem").getTitle())],
                    template: new sap.ui.core.Item({ text: "{odataHelp>Addsc}", key: "{odataHelp>Addsc}" })
                })
            },
            cancelBPC: function (oEvent) {
                oEvent.getSource().getBinding("items").filter([]);
            },
            onSelectDireccion: function (oEvent) {
                if (oEvent.getSource().getValue() !== "") {
                    var direccionesClienteSelect = this.getView().byId("customer.zmmpomanages1pa.DireccionesClienteSelect");
                    direccionesClienteSelect.bindAggregation("items", {
                        path: "odataHelp>/CountryDescSet",
                        filters: [new sap.ui.model.Filter("Partner", "EQ", oEvent.getSource().getValue())],
                        template: new sap.ui.core.Item({ text: "{odataHelp>Addsc}", key: "{odataHelp>Addsc}" })
                    })
                }
            },
            onChangeDireccion: function (oEvent) {

            },
            onSelectBP: function (oEvent) {
                if (!oEvent.getParameter("selected")) {
                    var sPath = this.getView().getBindingContext().getPath();
                    var oModel = this.getView().getModel();
                    oModel.setProperty(sPath + "/ZZ1_BPCliente_PDI", "");
                    oModel.setProperty(sPath + "/ZZ1_direccionBP_PDI", "");
                    oModel.setProperty(sPath + "/ZZ1_aplicarPosiciones_PDI", false);
                }

            },
            //BEGIN - TS119 - RJV
            //BEGIN - CO120 - RJV
            onEditZOR: function (oEvent) {
                /*if(!this.dialogZOR){
                    this.dialogZOR = sap.ui.xmlfragment("customer.zmmpomanages1pa.changes.fragments.dialogEditZOR",
                    this);
                    this.getView().addDependent(this.dialogZOR);
                }
                this.dialogZOR.open();
                this.dialogZOR.bindElement(this.getView().getBindingContext().getPath());*/

                var buttonEdit = this.getView().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--edit");

                buttonEdit.firePress();

                jQuery.sap.delayedCall(3000, this, function () {
                    this.getView().getModel("ui").setProperty("/editable", false);
                    //Se bloquea el textoç
                    var textarea = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--ReuseNotesFacet::SubSection-innerGrid").getContent()[0].getContent()[0].getComponentInstance().getRootControl().byId("IconTabBarId").getItems()[0].getContent()[0];
                    textarea.setEditable(false);
                }.bind(this));
                /*
                             setTimeout($.proxy(function() {
                                this.getView().getModel("ui").setProperty("enabled",false);
                             },this),3000);*/

                this.isEditZOR = true;
                var uploadCollection = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload");
                var addButton = document.getElementById("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload-1-uploader-fu");
                uploadCollection.setUploadEnabled(true)
                uploadCollection.getToolbar().addContent(new sap.m.Button({ text: "Cargar" }).attachPress(function () {
                    addButton.disabled = false;
                    addButton.click();
                }.bind(this)))


                /*uploadCollection.attachUploadComplete(function(){
                    var addButton = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload-1-uploader");
                    addButton.unbindProperty("enabled");
                    addButton.setEnabled(true);
                }.bind(this))
                var addButton = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload-1-uploader");
                    
                addButton.unbindProperty("enabled");
                addButton.setEnabled(true);*/

            },
            setFieldsDisabledZOR: function () {
                var root = "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--";
                //sap.ui.getCore().byId(root + "GeneralInformationFacet1::PurchaseOrderType::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet1::PurchaseOrderType::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "GeneralInformationFacet1::DocumentCurrency::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet1::DocumentCurrency::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "GeneralInformationFacet2::PurchasingGroup::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet2::PurchasingGroup::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "GeneralInformationFacet2::PurchasingOrganization::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet2::PurchasingOrganization::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "GeneralInformationFacet2::CompanyCode::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet2::CompanyCode::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.inputContrEM") ? sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.inputContrEM").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "DeliveryInvoiceFacet1::PaymentTerms::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet1::PaymentTerms::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "CashDiscount1Days") ? sap.ui.getCore().byId(root + "CashDiscount1Days").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "CashDiscount1Percent") ? sap.ui.getCore().byId(root + "CashDiscount1Percent").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "CashDiscount2Days") ? sap.ui.getCore().byId(root + "CashDiscount2Days").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "CashDiscount2Percent") ? sap.ui.getCore().byId(root + "CashDiscount2Percent").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "NetPaymentDays") ? sap.ui.getCore().byId(root + "NetPaymentDays").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "DeliveryInvoiceFacet2::IncotermsClassification::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet2::IncotermsClassification::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "DeliveryInvoiceFacet2::IncotermsLocation1::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet2::IncotermsLocation1::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::InvoicingParty::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::InvoicingParty::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::ExchangeRateForEdit::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::ExchangeRateForEdit::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::ExchangeRateIsFixed::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::ExchangeRateIsFixed::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierAddressFacet1::FullName::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet1::FullName::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierAddressFacet1::StreetName::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet1::StreetName::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierAddressFacet1::HouseNumber::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet1::HouseNumber::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierAddressFacet2::PostalCode::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet2::PostalCode::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierAddressFacet2::CityName::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet2::CityName::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierAddressFacet2::Country::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet2::Country::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierAddressFacet2::Region::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet2::Region::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierAddressFacet3::PhoneNumber::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet3::PhoneNumber::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierAddressFacet3::FaxNumber::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet3::FaxNumber::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierContactPersonFacet::SupplierRespSalesPersonName::Field") ? sap.ui.getCore().byId(root + "SupplierContactPersonFacet::SupplierRespSalesPersonName::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierContactPersonFacet::SupplierPhoneNumber::Field") ? sap.ui.getCore().byId(root + "SupplierContactPersonFacet::SupplierPhoneNumber::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierContactPersonFacet::CorrespncExternalReference::Field") ? sap.ui.getCore().byId(root + "SupplierContactPersonFacet::CorrespncExternalReference::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "SupplierContactPersonFacet::CorrespncInternalReference::Field") ? sap.ui.getCore().byId(root + "SupplierContactPersonFacet::CorrespncInternalReference::Field").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "creWitRefBut") ? sap.ui.getCore().byId(root + "creWitRefBut").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "restoreBut") ? sap.ui.getCore().byId(root + "restoreBut").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "deleteBut") ? sap.ui.getCore().byId(root + "deleteBut").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "ItemsFacet::addEntry") ? sap.ui.getCore().byId(root + "ItemsFacet::addEntry").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "ItemsFacet::pasteEntries") ? sap.ui.getCore().byId(root + "ItemsFacet::pasteEntries").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "restoreLimitBut") ? sap.ui.getCore().byId(root + "restoreLimitBut").setBlocked(true) : '';
                sap.ui.getCore().byId(root + "deleteLimitBut") ? sap.ui.getCore().byId(root + "deleteLimitBut").setBlocked(true) : '';
                sap.ui.getCore().byId(root + "creLimitItemBut") ? sap.ui.getCore().byId(root + "creLimitItemBut").setBlocked(true) : '';
                sap.ui.getCore().byId(root + "LimitItemsFacet::addEntry") ? sap.ui.getCore().byId(root + "LimitItemsFacet::addEntry").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "LimitItemsFacet::pasteEntries") ? sap.ui.getCore().byId(root + "LimitItemsFacet::pasteEntries").setEnabled(false) : '';
                sap.ui.getCore().byId(root + "GeneralInformationFacet3::FormGroup_C_PurchaseOrderTPType_ZZ1_RESP_EM-element0") ? sap.ui.getCore().byId(root + "GeneralInformationFacet3::FormGroup_C_PurchaseOrderTPType_ZZ1_RESP_EM-element0").setEnabled(false) : '';

            },

            setFieldsEnabledZOR: function () {
                var root = "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--";
                //sap.ui.getCore().byId(root + "GeneralInformationFacet1::PurchaseOrderType::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet1::PurchaseOrderType::Field").setEnabled(true) : '';
                if(sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.inputContrEM") && sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.inputContrEM").getModel("ui").getData.editable === true){
                    sap.ui.getCore().byId(root + "GeneralInformationFacet1::DocumentCurrency::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet1::DocumentCurrency::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "GeneralInformationFacet2::PurchasingGroup::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet2::PurchasingGroup::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "GeneralInformationFacet2::PurchasingOrganization::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet2::PurchasingOrganization::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "GeneralInformationFacet2::CompanyCode::Field") ? sap.ui.getCore().byId(root + "GeneralInformationFacet2::CompanyCode::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.inputContrEM") ? sap.ui.getCore().byId(root + "customer.zmmpomanages1pa.inputContrEM").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "DeliveryInvoiceFacet1::PaymentTerms::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet1::PaymentTerms::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "CashDiscount1Days") ? sap.ui.getCore().byId(root + "CashDiscount1Days").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "CashDiscount1Percent") ? sap.ui.getCore().byId(root + "CashDiscount1Percent").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "CashDiscount2Days") ? sap.ui.getCore().byId(root + "CashDiscount2Days").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "CashDiscount2Percent") ? sap.ui.getCore().byId(root + "CashDiscount2Percent").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "NetPaymentDays") ? sap.ui.getCore().byId(root + "NetPaymentDays").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "DeliveryInvoiceFacet2::IncotermsClassification::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet2::IncotermsClassification::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "DeliveryInvoiceFacet2::IncotermsLocation1::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet2::IncotermsLocation1::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::InvoicingParty::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::InvoicingParty::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::ExchangeRateForEdit::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::ExchangeRateForEdit::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::ExchangeRateIsFixed::Field") ? sap.ui.getCore().byId(root + "DeliveryInvoiceFacet3::ExchangeRateIsFixed::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierAddressFacet1::FullName::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet1::FullName::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierAddressFacet1::StreetName::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet1::StreetName::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierAddressFacet1::HouseNumber::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet1::HouseNumber::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierAddressFacet2::PostalCode::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet2::PostalCode::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierAddressFacet2::CityName::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet2::CityName::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierAddressFacet2::Country::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet2::Country::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierAddressFacet2::Region::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet2::Region::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierAddressFacet3::PhoneNumber::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet3::PhoneNumber::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierAddressFacet3::FaxNumber::Field") ? sap.ui.getCore().byId(root + "SupplierAddressFacet3::FaxNumber::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierContactPersonFacet::SupplierRespSalesPersonName::Field") ? sap.ui.getCore().byId(root + "SupplierContactPersonFacet::SupplierRespSalesPersonName::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierContactPersonFacet::SupplierPhoneNumber::Field") ? sap.ui.getCore().byId(root + "SupplierContactPersonFacet::SupplierPhoneNumber::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierContactPersonFacet::CorrespncExternalReference::Field") ? sap.ui.getCore().byId(root + "SupplierContactPersonFacet::CorrespncExternalReference::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "SupplierContactPersonFacet::CorrespncInternalReference::Field") ? sap.ui.getCore().byId(root + "SupplierContactPersonFacet::CorrespncInternalReference::Field").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "creWitRefBut") ? sap.ui.getCore().byId(root + "creWitRefBut").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "restoreBut") ? sap.ui.getCore().byId(root + "restoreBut").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "deleteBut") ? sap.ui.getCore().byId(root + "deleteBut").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "ItemsFacet::addEntry") ? sap.ui.getCore().byId(root + "ItemsFacet::addEntry").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "ItemsFacet::pasteEntries") ? sap.ui.getCore().byId(root + "ItemsFacet::pasteEntries").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "restoreLimitBut") ? sap.ui.getCore().byId(root + "restoreLimitBut").setBlocked(false) : '';
                    sap.ui.getCore().byId(root + "deleteLimitBut") ? sap.ui.getCore().byId(root + "deleteLimitBut").setBlocked(false) : '';
                    sap.ui.getCore().byId(root + "creLimitItemBut") ? sap.ui.getCore().byId(root + "creLimitItemBut").setBlocked(false) : '';
                    sap.ui.getCore().byId(root + "LimitItemsFacet::addEntry") ? sap.ui.getCore().byId(root + "LimitItemsFacet::addEntry").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "LimitItemsFacet::pasteEntries") ? sap.ui.getCore().byId(root + "LimitItemsFacet::pasteEntries").setEnabled(true) : '';
                    sap.ui.getCore().byId(root + "GeneralInformationFacet3::FormGroup_C_PurchaseOrderTPType_ZZ1_RESP_EM-element0") ? sap.ui.getCore().byId(root + "GeneralInformationFacet3::FormGroup_C_PurchaseOrderTPType_ZZ1_RESP_EM-element0").setEnabled(true) : '';
                }
            },
            dialogAsignarClasificacion: function () {
                /*var oList = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--attachmentReuseComponent::simple::Attachments::ComponentContainerContent---attachmentService--attachmentServiceFileUpload")
                this.oDialog = new sap.m.Dialog({
                    title: "Asignar Clasificación",
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.RadioButton({
                                    text: "Interno (I)",
                                    selected: "{JSON_MDL>/Type/TypeI}",
                                    enabled: "{JSON_MDL>/Type/Flag}"
                                }),
                                new sap.m.RadioButton({
                                    text: "Externo (E)",
                                    selected: "{JSON_MDL>/Type/TypeE}",
                                    enabled: "{JSON_MDL>/Type/Flag}"
                                })
                            ]
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "Guardar",
                            press: (oEvt) => {
                                this._saveClasification.bind(this)(oEvt, this.oDialog);
                            }
                        }),
                        new sap.m.Button({
                            text: "Cancelar",
                            press: (oEvt) => {
                                this.oDialog.close();
                            }
                        })
                    ],
                    beforeOpen: () => {
                        var sOrigin = this.getView().getModel("JSON_MDL").getProperty("/Origin");
                        var oBindingContext = oList.getBindingContext();
                        if (sOrigin == "Upload") {
                            return;
                        }
                        var sUrl = "/TipoAnexosI_ESet(Zzsociedad='" + oBindingContext.getProperty("CompanyCode") +
                            "',ZztipoDoc='F" +
                            "',ZzclaseDoc='" + oBindingContext.getProperty("PurchaseOrderType") +
                            "',ZzOrgComp='')";
                        this.getView().getModel("MDL_SCD").read(sUrl, {
                            success: (oResult) => {
                                if (oResult.ZzindExIn == "I" || oResult.ZzindExIn == "E") {
                                    oResult.TypeI = false;
                                    oResult.TypeE = false;
                                    if (oResult.ZzindExIn == "I") {
                                        oResult.TypeI = true;
                                    } else if (oResult.ZzindExIn == "E") {
                                        oResult.TypeE = true;
                                    }
                                    this.getView().getModel("JSON_MDL").setProperty("/Type", oResult);
                                    oResult.Flag = false;
                                } else {
                                    this.getView().getModel("JSON_MDL").setProperty("/Type", oResult);
                                    oResult.Flag = true;
                                }
                                this.oDialog.open();
                            },
                            error: () => {
                                this.oDialog.close();
                            }
                        });
                    },
                    escapeHandler: function (oPromise) {
                        oPromise.reject();
                    }
                });
                this.getView().addDependent(this.oDialog);*/
                var oContextItem = this.oList.getSelectedItem() ? this.oList.getSelectedItem()[0].getBindingContext("__attachmentData").getObject() : null
                if (!oContextItem) {
                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                    sap.m.MessageToast.show(oResourceBundle.getText("seleccionarAdjunto"));
                    return;
                }
                this.oDialog.open();
            },
            //END - CO120 - RJV
            //BEGIN - RJV - TS122 - 11/10/2022
            onChangeFechaIni: function () {

            },
            getPurchaseOrderInPos: function () {
                if (this.getView().getBindingContext().getObject() && this.getView().getBindingContext().getObject().PurchaseOrderType) {
                    return this.getView().getBindingContext().getObject().PurchaseOrderType;
                } else {
                    if(sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--template::ObjectPage::ObjectPageHeader")){
                        var sPath = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--template::ObjectPage::ObjectPageHeader").getBreadcrumbs().getLinks()[0].getHref().split("/C_PurchaseOrderTP")[1];
                        return this.getView().getModel().getProperty("/C_PurchaseOrderTP"+sPath+"/PurchaseOrderType");
                    }else{
                        return "";
                    }                    
                }
                
            },
            /* BORRAR REFACTOR 
            //BEGIN JMD: ESFU CO124
            onInitTaxonomia: function () {
                this.getView().setModel(new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCDS_F4_RELTAXGRU_CDS"), "ZCDS_F4_RELTAXGRU_CDS");
                this.getView().setModel(new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZCDS_F4_RELTAXGRU_001_CDS"), "ZCDS_F4_RELTAXGRU_001_CDS");
                // obtener taxonomías
                this.getServiceRelacionTaxGrupo();

                // setear columnas para value help de taxonomías
                var oColumnsTaxo = new sap.ui.model.json.JSONModel({
                    "cols": [{
                        "label": "Taxonomía",
                        "template": "Taxo>Code",
                        "width": "8rem"
                    }, {
                        "label": "Taxonomía (Descr.)",
                        "template": "Taxo>Description",
                        "width": "18rem"
                    }, {
                        "label": "Idioma",
                        "template": "Taxo>Idioma",
                        "width": "18rem"
                    }]
                });
                this.getView().setModel(oColumnsTaxo, "columnasModelTaxo");

            },

            getServiceRelacionTaxGrupo: function () {
                var that = this;
                
                    var ZCDS_F4_RELTAXGRU_001_CDS = this.getView().getModel("ZCDS_F4_RELTAXGRU_001_CDS");
                    ZCDS_F4_RELTAXGRU_001_CDS.read("/ZCDS_F4_RELTAXGRU_001", {
                        async: false,
                        success: function (res) {
                            var value = {};
                            var dato = res.results.reduce(function (r, o) {
                                var key = o.Taxonomia;
                                if (!value[key]) {
                                    value[key] = {
                                        "Taxonomia": o.Taxonomia,
                                        "Matkl": o.Matkl,
                                        "DescTaxonomia": o.DescTaxonomia,
                                        "DescMatkl": o.DescMatkl
                                    };
                                    r.push(value[key]);
                                }
                                return r;
                            }, []);
                            that.aResultsTaxZNM = res.results;
                            that.localmodelZNM = new sap.ui.model.json.JSONModel(dato);
                        },
                        error: function (err) {
                        }
                    });
                    var ZCDS_F4_RELTAXGRU_CDS = this.getView().getModel("ZCDS_F4_RELTAXGRU_CDS");
                    ZCDS_F4_RELTAXGRU_CDS.read("/ZCDS_F4_RELTAXGRU", {
                        async: false,
                        success: function (res) {
                            var value = {};
                            var dato = res.results.reduce(function (r, o) {
                                var key = o.Taxonomia;
                                if (!value[key]) {
                                    value[key] = {
                                        "Taxonomia": o.Taxonomia,
                                        "Matkl": o.Matkl,
                                        "DescTaxonomia": o.DescTaxonomia,
                                        "DescMatkl": o.DescMatkl
                                    };
                                    r.push(value[key]);
                                }
                                return r;
                            }, []);
                            that.aResultsTax = res.results;
                            that.localmodel = new sap.ui.model.json.JSONModel(dato);
                        },
                        error: function (err) {
                        }
                    });
                
            },
            */
            purchaseGroupRel: function (){
                var sBukrs="";
                var sPurchasingGroup="";
                if (this.getView().getBindingContext() && this.getView().getBindingContext().getObject()) {
                    sBukrs = this.getView().getBindingContext().getObject().CompanyCode ? this.getView().getBindingContext().getObject().CompanyCode : "";
                    sPurchasingGroup = this.getView().getBindingContext().getObject().PurchasingGroup ? this.getView().getBindingContext().getObject().PurchasingGroup : "";
                }

                if (sBukrs !== "" && sBukrs !== undefined) {
                    var idTableGrupoCompr = sap.ui.getCore().byId(
                        "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet2::PurchasingGroup::Field-input-valueHelpDialog-table"
                    );
                    var valueHelpGrupoCompr = sap.ui.getCore().byId(
                        "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet2::PurchasingGroup::Field-input-valueHelpDialog"
                    );

                    if (idTableGrupoCompr !== undefined) {
                        if (valueHelpGrupoCompr.data("OUT") !== true) {
                            valueHelpGrupoCompr.data("OUT", true);
                            this.getView().getModel("ZMM_PURCHASEGROUP_SH_REL_TABLE_SRV").read("/Purchase_group_relationSet", {
                            filters: [new sap.ui.model.Filter("Zzsociedad", "EQ", sBukrs)],
                            success: function (data) {
                                var a_FilterBukrs = [];
                                data.results.forEach(function (line) {
                                    var oFilterGroup = new sap.ui.model.Filter("PurchasingGroup", "EQ", line.Zzgc);
                                    a_FilterBukrs.push(oFilterGroup)
                                });
                                if (a_FilterBukrs.length === 0) {
                                    idTableGrupoCompr.getBinding("rows").filter([new sap.ui.model.Filter("PurchasingGroup", "EQ", "")]);
                                } else {
                                    idTableGrupoCompr.getBinding("rows").filter(a_FilterBukrs);
                                }
                            }
                        });
                        }
                    }
                }

                if (sPurchasingGroup !== "" && sPurchasingGroup !== undefined) {
                    var idTableSociedad = sap.ui.getCore().byId(
                        "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet2::CompanyCode::Field-input-valueHelpDialog-table"
                    );
                    var valueHelpSociedad = sap.ui.getCore().byId(
                        "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet2::CompanyCode::Field-input-valueHelpDialog"
                    );

                    if (idTableSociedad !== undefined) {
                        if (valueHelpSociedad.data("OUT") !== true) {
                            valueHelpSociedad.data("OUT", true);
                            this.getView().getModel("ZMM_PURCHASEGROUP_SH_REL_TABLE_SRV").read("/Purchase_group_relationSet", {
                            filters: [new sap.ui.model.Filter("Zzgc", "EQ", sPurchasingGroup)],
                            success: function (data) {
                                var a_Filter = [];
                                data.results.forEach(function (line) {
                                    var oFilterGroup = new sap.ui.model.Filter("CompanyCode", "EQ", line.Zzsociedad);
                                    a_Filter.push(oFilterGroup)
                                });
                                if (a_Filter.length === 0) {
                                    idTableSociedad.getBinding("rows").filter([new sap.ui.model.Filter("CompanyCode", "EQ", "")]);
                                } else {
                                    idTableSociedad.getBinding("rows").filter(a_Filter);
                                }
                            }
                        });
                        }
                    }
                }
            },
            onAfterRenderingTaxonomia: function () {
                /* BORRAR REFACTOR 
                        var localmodel, idTaxo_, idGrupoArticulo, valueGrupoArticulo, idInpTaxonomia, idTextTaxonomia,
                            idValueHelpTaxonomia,
                            idDlgInputTaxo,
                            idDlgInputTaxoDesc,
                            idDlgInputTaxoIdioma,
                            idTableTaxonomia,
                            idSelectKeyOrdCompra,
                            idFormTaxo,
                            aToken = [],
                            oColumnsTaxo = this.getView().getModel("columnasModelTaxo"),
                            that = this;
                    
                        localmodel = new sap.ui.model.json.JSONModel();
        
                        idGrupoArticulo = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::MaterialGroup::Field"
                        );
        
                        idInpTaxonomia = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_TAXONOMIA2-element0-input"
                        );
                        if(idInpTaxonomia){
                            idInpTaxonomia.attachChange((oEvent) => {
                                this.setResetTaxonomiaDesc(oEvent);
                            });
                        }
        
                        idTextTaxonomia = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::MaterialGroup::Field-text"
                        );
        
                        idValueHelpTaxonomia = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_TAXONOMIA2-element0-input-valueHelpDialog"
                        );
                        if(idValueHelpTaxonomia){
                            idValueHelpTaxonomia.attachAfterOpen(this.setFiltersTaxonomia(idValueHelpTaxonomia));
                            idValueHelpTaxonomia.attachOk((oEvent) => {
                                this.setResetTaxonomiaDesc(oEvent);
                            });
                        }
                        idDlgInputTaxo = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_TAXONOMIA2-element0-input-valueHelpDialog-smartFilterBar-filterItemControlA_-Code"
                        );
        
                        idDlgInputTaxoDesc = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_TAXONOMIA2-element0-input-valueHelpDialog-smartFilterBar-filterItemControlA_-Description"
                        );
                        idDlgInputTaxoIdioma = sap.ui.getCore().byId("ControlA_-Idioma");
                        
                        idTableTaxonomia = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_TAXONOMIA2-element0-input-valueHelpDialog-table"
                        );
        
                        idSelectKeyOrdCompra = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--GeneralInformationFacet1::PurchaseOrderType::Field-comboBoxEdit"
                        );
        
                        idFormTaxo = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_TAXONOMIA2"
                        );
                   
                        if (idSelectKeyOrdCompra !== undefined) {
        
                            if (idSelectKeyOrdCompra?.mProperties?.selectedKey === "ZLT" ||
                                idSelectKeyOrdCompra?.mProperties?.selectedKey === "ZDE" || idSelectKeyOrdCompra?.mProperties?.selectedKey === "ZOR" || 
                                idSelectKeyOrdCompra?.mProperties?.selectedKey === "ZNM") {
                                idFormTaxo?.setVisible(true);
                            } else {
                                idFormTaxo?.setVisible(false);
                            }
                        }
                         
        
                        if (idInpTaxonomia !== undefined) {
                            idInpTaxonomia?.setShowSuggestion(false);
                        }
        */
                // BEGIN REFACTOR TAXONOMIA - RJV - 05/06/2023
                var idFormTaxo = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.inputTaxonomia")

                var purchaseOrderType = this.getPurchaseOrderInPos();

                if (purchaseOrderType) {

                    if (purchaseOrderType === "ZLT" || purchaseOrderType === "ZDE" ||
                        purchaseOrderType === "ZOR" || purchaseOrderType === "ZNM") {
                        idFormTaxo?.setVisible(true);
                    } else {
                        idFormTaxo?.setVisible(false);
                    }
                }
                var taxonomia = "";
                var sBukrs = "";
                var sBsart = this.getPurchaseOrderInPos();
                if (this.getView().getBindingContext() && this.getView().getBindingContext().getObject()) {
                    //taxonomia = this.getView().getBindingContext().getObject() ? this.getView().getBindingContext().getObject().ZZ_TAXONOMIA2 : "";
                    taxonomia = idFormTaxo ? idFormTaxo.getValue() : "";
                    sBukrs = this.getView().getBindingContext().getObject().CompanyCode ? this.getView().getBindingContext().getObject().CompanyCode : "";
                }
                if (taxonomia !== "" && taxonomia !== undefined) {
                    var idTableGrupoArt = sap.ui.getCore().byId(
                        "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::MaterialGroup::Field-input-valueHelpDialog-table"
                    );
                    var valueHelpGrupoArt = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::MaterialGroup::Field-input-valueHelpDialog")
                    if (idTableGrupoArt !== undefined) {
                        if (valueHelpGrupoArt.data("OUT") !== true) {
                            valueHelpGrupoArt.data("OUT", true);
                            purchaseOrderType = purchaseOrderType === "ZNM" ? purchaseOrderType : "";
                            this.getView().getModel("ZCDS_F4_RELTAXGRU_CDS").read("/ZCDS_F4_RELTAXGRU(in_bukrs='" + sBukrs + "',in_bsart='" + sBsart + "',in_Matkl='**')/Set", {
                                filters: [new sap.ui.model.Filter("Taxonomia", "EQ", taxonomia)],
                                success: function (data) {
                                    var a_FilterTaxo = [];
                                    data.results.forEach(function (line) {
                                        var oFilterGroup = new sap.ui.model.Filter("MaterialGroup", "EQ", line.matkl);
                                        a_FilterTaxo.push(oFilterGroup)
                                    });
                                    if (a_FilterTaxo.length === 0) {
                                        idTableGrupoArt.getBinding("rows").filter([new sap.ui.model.Filter("MaterialGroup", "EQ", "")]);
                                    } else {
                                        idTableGrupoArt.getBinding("rows").filter(a_FilterTaxo);
                                    }
                                }
                            });
                        }
                    }
                }

                // END REFACTOR TAXONOMIA - RJV - 05/06/2023
                /* BORRAR REFACTOR 
                //LÓGICA PARA TAXÓNOMIA
                // SI EL CAMPO GRUPO ARTICULO ESTA COMO TEXTO INGRESA AL IF

                if (idGrupoArticulo !== null) {
                    valueGrupoArticulo = idGrupoArticulo.getBindingContext()?.getObject()?.MaterialGroup;

                    if (valueGrupoArticulo !== "" && idTableTaxonomia !== undefined) {

                        var a_Data, a_Data1, filtro;
                        a_Data = [];
                        a_Data1 = [];

                        if(that.getPurchaseOrderInPos() === "ZNM"){
                            filtro = that.aResultsTaxZNM.filter(e => e.Matkl === valueGrupoArticulo);
                        }else{
                            filtro = that.aResultsTax.filter(e => e.Matkl === valueGrupoArticulo);
                        }
                        
                        filtro.forEach(function (line) {
                            var obj = {
                                Code: line.Taxonomia,
                                Description: line.DescTaxonomia
                            };
                            a_Data.push(obj);
                        });

                        if (idDlgInputTaxo.getTokens().length !== 0) {
                            for (var i = 0; i <= idDlgInputTaxo.getTokens().length - 1; i++) {
                                var oValue = idDlgInputTaxo.getTokens()[i].mProperties.text.slice(1);
                                var filtro_ = a_Data.filter(e => e.Code === oValue);
                                if (filtro_.length !== 0) {
                                    aToken.push(filtro_[0]);
                                }
                            }
                            localmodel.setProperty("/ModelTaxonomia", aToken);

                        } else if (idDlgInputTaxoDesc.getTokens().length !== 0) {
                            for (var j = 0; j <= idDlgInputTaxoDesc.getTokens().length - 1; j++) {
                                var oValue = idDlgInputTaxoDesc.getTokens()[0].mProperties.text.slice(1);
                                var filtro_ = a_Data.filter(e => e.Description === oValue);
                                if (filtro_.length !== 0) {
                                    aToken.push(filtro_[0]);
                                }
                            }

                            localmodel.setProperty("/ModelTaxonomia", aToken);

                        }else if(idDlgInputTaxoIdioma && idDlgInputTaxoIdioma.getValue() !== ""){
                            var oValue = idDlgInputTaxoIdioma.getValue();
                            var filtro_ = a_Data.filter(e => e.Idioma === oValue);
                            if (filtro_.length !== 0) {
                                aToken.push(filtro_[0]);
                            }  
                            localmodel.setProperty("/ModelTaxonomia", aToken);
                        } else {
                            localmodel.setProperty("/ModelTaxonomia", a_Data);
                        }

                        idValueHelpTaxonomia.getTableAsync().then(function (oTable) {
                            oTable.setModel(localmodel, "Taxo");

                            oTable.setModel(oColumnsTaxo, "columns");
                            oTable.bindAggregation("rows", {
                                path: "Taxo>/ModelTaxonomia"
                            });
                        });

                    } else {

                        // EN CASO HAYA DATA EN TAX Y SE ABRA EL FRAGMENT DE TAXO
                        if (idInpTaxonomia !== undefined) {
                            if (idValueHelpTaxonomia !== undefined && valueGrupoArticulo === "" && idInpTaxonomia.getValue() !== "") {
                                var a_Data, filtro;
                                a_Data = [];
                                if(that.getPurchaseOrderInPos() === "ZNM"){
                                    filtro = that.localmodelZNM.getData().filter(e => e.Matkl !== "");
                                }else{
                                    filtro = that.localmodel.getData().filter(e => e.Matkl !== "");
                                }
                                filtro.forEach(function (line) {
                                    var obj = {
                                        Code: line.Taxonomia,
                                        Description: line.DescTaxonomia
                                    };
                                    a_Data.push(obj);
                                });
                                if (idDlgInputTaxo.getTokens().length !== 0) {

                                    for (var i = 0; i <= idDlgInputTaxo.getTokens().length - 1; i++) {
                                        var oValue = idDlgInputTaxo.getTokens()[i].mProperties.text.slice(1);
                                        var filtro_ = a_Data.filter(e => e.Code === oValue);
                                        if (filtro_.length !== 0) {
                                            aToken.push(filtro_[0]);
                                        }
                                    }

                                    localmodel.setProperty("/ModelTaxonomia", aToken);

                                } else if (idDlgInputTaxoDesc.getTokens().length !== 0) {
                                    for (var j = 0; j <= idDlgInputTaxoDesc.getTokens().length - 1; j++) {
                                        var oValue = idDlgInputTaxoDesc.getTokens()[j].mProperties.text.slice(1);
                                        var filtro_ = a_Data.filter(e => e.Description === oValue);
                                        if (filtro_.length !== 0) {
                                            aToken.push(filtro_[0]);
                                        }
                                    }

                                    localmodel.setProperty("/ModelTaxonomia", aToken);

                                } else {
                                    localmodel.setProperty("/ModelTaxonomia", a_Data);
                                }
                                idValueHelpTaxonomia.getTableAsync().then(function (oTable) {
                                    oTable.setModel(localmodel, "Taxo");

                                    oTable.setModel(oColumnsTaxo, "columns");
                                    oTable.bindAggregation("rows", {
                                        path: "Taxo>/ModelTaxonomia"
                                    });
                                });
                                return;
                            }
                        }

                    }
                } else {

                    if (idGrupoArticulo !== null) {

                        var oValueGrupoArticulo, dataGrupo;
                        oValueGrupoArticulo = idGrupoArticulo.getBindingContext()?.getObject()?.MaterialGroup;
                        dataGrupo = oValueGrupoArticulo.slice(oValueGrupoArticulo.indexOf("(")).slice(1, -1) !== "" ? oValueGrupoArticulo.slice(
                            oValueGrupoArticulo.indexOf("(")).slice(1, -1) : oValueGrupoArticulo;

                        if (dataGrupo !== "") {

                            if (idTableTaxonomia !== undefined) {

                                var a_Data, filtro;

                                a_Data = [];
                                if(that.getPurchaseOrderInPos() === "ZNM"){
                                    filtro = that.localmodelZNM.getData().filter(e => e.Matkl === dataGrupo);
                                }else{
                                    filtro = that.localmodel.getData().filter(e => e.Matkl === dataGrupo);
                                }
                                filtro.forEach(function (line) {
                                    var obj = {
                                        Code: line.Taxonomia,
                                        Description: line.DescTaxonomia
                                    };
                                    a_Data.push(obj);
                                });

                                if (idDlgInputTaxo.getTokens().length !== 0) {
                                    for (var i = 0; i <= idDlgInputTaxo.getTokens().length - 1; i++) {
                                        var oValue = idDlgInputTaxo.getTokens()[i].mProperties.text.slice(1);
                                        var filtro_ = a_Data.filter(e => e.Code === oValue);
                                        if (filtro_.length !== 0) {
                                            aToken.push(filtro_[0]);
                                        }
                                    }
                                    localmodel.setProperty("/ModelTaxonomia", aToken);

                                } else if (idDlgInputTaxoDesc.getTokens().length !== 0) {
                                    for (var j = 0; j <= idDlgInputTaxoDesc.getTokens().length - 1; j++) {
                                        var oValue = idDlgInputTaxoDesc.getTokens()[j].mProperties.text.slice(1);
                                        var filtro_ = a_Data.filter(e => e.Description === oValue);
                                        if (filtro_.length !== 0) {
                                            aToken.push(filtro_[0]);
                                        }
                                    }
                                    localmodel.setProperty("/ModelTaxonomia", aToken);
                                } else {
                                    localmodel.setProperty("/ModelTaxonomia", a_Data);
                                }

                                idValueHelpTaxonomia.getTableAsync().then(function (oTable) {
                                    oTable.setModel(localmodel, "Taxo");

                                    oTable.setModel(oColumnsTaxo, "columns");
                                    oTable.bindAggregation("rows", {
                                        path: "Taxo>/ModelTaxonomia"
                                    });
                                });
                                return;
                            }
                        }

                    } else if (idTextTaxonomia !== undefined) {

                        if (idTableTaxonomia !== undefined) {

                            var a_Data, filtro, txtValueTaxo;
                            txtValueTaxo = idTextTaxonomia.getText().lastIndexOf("(") === -1 ? idTextTaxonomia.getText() : idTextTaxonomia.getText().slice(
                                idTextTaxonomia.getText().lastIndexOf("(") + 1, -1);
                            a_Data = [];
                            if(that.getPurchaseOrderInPos() === "ZNM"){
                                filtro = that.localmodelZNM.getData().filter(e => e.Matkl === txtValueTaxo);
                            }else{
                                 filtro = that.localmodel.getData().filter(e => e.Matkl === txtValueTaxo);
                            }
                            filtro.forEach(function (line) {
                                var obj = {
                                    Code: line.Taxonomia,
                                    Description: line.DescTaxonomia
                                };
                                a_Data.push(obj);
                            });

                            if (idDlgInputTaxo.getTokens().length !== 0) {
                                for (var i = 0; i <= idDlgInputTaxo.getTokens().length - 1; i++) {
                                    var oValue = idDlgInputTaxo.getTokens()[i].mProperties.text.slice(1);
                                    var filtro_ = a_Data.filter(e => e.Code === oValue);
                                    if (filtro_.length !== 0) {
                                        aToken.push(filtro_[0]);
                                    }
                                }
                                localmodel.setProperty("/ModelTaxonomia", aToken);

                            } else if (idDlgInputTaxoDesc.getTokens().length !== 0) {
                                for (j = 0; j <= idDlgInputTaxoDesc.getTokens().length - 1; j++) {
                                    var oValue = idDlgInputTaxoDesc.getTokens()[j].mProperties.text.slice(1);
                                    var filtro_ = a_Data.filter(e => e.Description === oValue);
                                    if (filtro_.length !== 0) {
                                        aToken.push(filtro_[0]);
                                    }
                                }
                                localmodel.setProperty("/ModelTaxonomia", aToken);

                            } else {
                                localmodel.setProperty("/ModelTaxonomia", a_Data);
                            }

                            idValueHelpTaxonomia.getTableAsync().then(function (oTable) {
                                oTable.setModel(localmodel, "Taxo");

                                oTable.setModel(oColumnsTaxo, "columns");
                                oTable.bindAggregation("rows", {
                                    path: "Taxo>/ModelTaxonomia"
                                });
                            });
                            return;
                        }

                    }

                }

                //LÓGICA PARA GRUPO ARTICULO

                if (idInpTaxonomia !== undefined) {

                    this.oFlagTaxo = this.oFlagTaxo === undefined || this.oFlagTaxo === true ? true : this.oFlagTaxo === "Salida" ? false : true;
                    if (this.oFlagTaxo === false) {
                        this.oFlagTaxo = undefined;
                        return;
                    }
                    var oValueTaxo, dataTaxo;
                    oValueTaxo = idInpTaxonomia === "" ? "" : idInpTaxonomia.getValue();
                    dataTaxo = oValueTaxo.slice(oValueTaxo.lastIndexOf("(")).slice(1, -1) !== "" ? oValueTaxo.slice(
                        oValueTaxo.lastIndexOf("(")).slice(1, -1) : oValueTaxo;
                    if (dataTaxo.length !== 4) {
                        dataTaxo = oValueTaxo.slice(oValueTaxo.lastIndexOf("(")).slice(1, -1);
                    }
                    if (dataTaxo !== "") {
                        var idTableGrupoArt, a_FilterTaxo, oFilterTaxo;

                        idTableGrupoArt = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::MaterialGroup::Field-input-valueHelpDialog-table"
                        );
                        a_FilterTaxo = [];
                        oFilterTaxo = new sap.ui.model.Filter("Taxonomia", "EQ", dataTaxo);

                        if (idTableGrupoArt !== undefined) {
                            var oFilterGroup, filtroTax;
                            if(that.getPurchaseOrderInPos() === "ZNM"){
                                filtroTax = that.aResultsTaxZNM.filter(e => e.Taxonomia === dataTaxo);
                            }else{
                                filtroTax = that.aResultsTax.filter(e => e.Taxonomia === dataTaxo);
                            }
                            this.oFlagTaxo = "Salida";

                            filtroTax.forEach(function (line) {
                                oFilterGroup = new sap.ui.model.Filter("MaterialGroup", "EQ", line.Matkl);
                                a_FilterTaxo.push(oFilterGroup)
                            });
                            if (a_FilterTaxo.length === 0) {
                                oFilterGroup = new sap.ui.model.Filter("MaterialGroup", "EQ", dataTaxo);
                                idTableGrupoArt.getBinding("rows").filter([oFilterGroup]);
                            } else {
                                idTableGrupoArt.getBinding("rows").filter(a_FilterTaxo);
                                this.Duplicate = false;
                            }
                        }
                    }else{
                        
                        var idTableGrupoArt, a_FilterTaxo, oFilterTaxo;
                        a_FilterTaxo = [];

                        idTableGrupoArt = sap.ui.getCore().byId(
                            "ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet3::MaterialGroup::Field-input-valueHelpDialog-table"
                        );
                        if(idTableGrupoArt && idTableGrupoArt.getBinding("rows")){
                            var oFilterGroup,filtroTax;
                            if(that.getPurchaseOrderInPos() === "ZNM"){
                                filtroTax = that.aResultsTaxZNM;
                            }
                            this.oFlagTaxo = "Salida";

                            filtroTax.forEach(function (line) {
                                oFilterGroup = new sap.ui.model.Filter("MaterialGroup", "EQ", line.Matkl);
                                a_FilterTaxo.push(oFilterGroup)
                            });
                            idTableGrupoArt.getBinding("rows").filter(a_FilterTaxo);
                            this.Duplicate = false;
                        }
                        }
                    // Si ya tiene taxonomia, se graba la descripción (en caso que estemos en modo edición)
                    if(this.getView().getModel("ui").getProperty("/editable")){
                        var arrayTaxo;
                        if(this.getPurchaseOrderInPos() === "ZNM"){
                            arrayTaxo = that.aResultsTaxZNM.filter(e => e.Taxonomia === dataTaxo);
                        }else{
                            arrayTaxo = that.aResultsTax.filter(e => e.Taxonomia === dataTaxo);
                        }
                        if(arrayTaxo.length > 0){
                            var oInput = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--GeneralInformationFacet2::FormGroup_C_PurchaseOrderItemTPType_ZZ_TAXONOMIA2-element0-input");
                            if(oInput && oInput.getBindingContext()){
                                //this.getView().getModel().setProperty(oInput.getBindingContext().getPath()+"/ZZ1_TAXONOMIA2_PDIT",arrayTaxo[0].DescTaxonomia);
                            }
                            
                        }
                    }
                }
/* BORRAR REFACTOR 
                //LÓGICA EN CASO NO HAYA DATA EN GRPO ARTICULO Y TAXO

                if (idGrupoArticulo !== null && idInpTaxonomia !== undefined) {

                    if (idGrupoArticulo.getBindingContext()?.getObject()?.MaterialGroup === "" && idInpTaxonomia.getValue() === "") {

                        that.validacionSinDataGrpArtTaxo(oColumnsTaxo, idTableTaxonomia, idGrupoArticulo, idInpTaxonomia, localmodel,
                            idValueHelpTaxonomia,
                            idDlgInputTaxo, idDlgInputTaxoDesc, idDlgInputTaxoIdioma);

                    }

                }
*/

            },
            /* BORRAR REFACTOR 
            validacionSinDataGrpArtTaxo: function (oColumnsTaxo, idTableTaxonomia, idGrupoArticulo, idInpTaxonomia, localmodel,
                idValueHelpTaxonomia,
                idDlgInputTaxo, idDlgInputTaxoDesc, idDlgInputTaxoIdioma) {

                var keysTaxonomia, resultFilter;

                if (idTableTaxonomia !== undefined) {
                    var a_Data, a_DataAux, keysData, data, data_aux, oValueDlgTaxo, aToken;
                    a_Data = [];
                    a_DataAux = [];
                    keysData = idTableTaxonomia.getBinding("rows").getModel().oData;

                    keysData = keysData.ModelTaxonomia === undefined ? keysData : keysData.ModelTaxonomia;

                    aToken = [];
                    if (keysData.length === undefined) {
                        Object.keys(keysData).forEach(function (line) {
                            if (line.indexOf("ZZ1_TAXONOMIA") === 0) {
                                a_Data.push(line);
                            }
                        });
                        a_Data.forEach(function (line) {
                            a_DataAux.push(keysData[line]);
                        });
                        //FILTRO
                        if (idDlgInputTaxo.getTokens().length !== 0) {
                            for (var i = 0; i <= idDlgInputTaxo.getTokens().length - 1; i++) {
                                var oValue = idDlgInputTaxo.getTokens()[i].mProperties.text.slice(1);
                                var filtro_ = a_DataAux.filter(e => e.Code === oValue);
                                if (filtro_.length !== 0) {
                                    aToken.push(filtro_[0]);
                                }
                            }
                            localmodel.setProperty("/ModelTaxonomia", aToken);

                        } else if (idDlgInputTaxoDesc.getTokens().length !== 0) {
                            for (var j = 0; j <= idDlgInputTaxoDesc.getTokens().length - 1; j++) {
                                var oValue = idDlgInputTaxoDesc.getTokens()[j].mProperties.text.slice(1);
                                var filtro_ = a_DataAux.filter(e => e.Description === oValue);
                                if (filtro_.length !== 0) {
                                    aToken.push(filtro_[0]);
                                }
                            }
                            localmodel.setProperty("/ModelTaxonomia", aToken);

                        } else {

                            localmodel.setProperty("/ModelTaxonomia", a_DataAux);

                        }

                    } else {

                        if (idDlgInputTaxo.getTokens().length !== 0) {
                            for (var i = 0; i <= idDlgInputTaxo.getTokens().length - 1; i++) {
                                var oValue = idDlgInputTaxo.getTokens()[i].mProperties.text.slice(1);
                                var filtro_ = keysData.filter(e => e.Taxonomia === oValue);
                                if (filtro_.length !== 0) {
                                    aToken.push(filtro_[0]);
                                }
                            }
                            localmodel.setProperty("/ModelTaxonomia", aToken);

                        } else if (idDlgInputTaxoDesc.getTokens().length !== 0) {
                            for (var j = 0; j <= idDlgInputTaxoDesc.getTokens().length - 1; j++) {
                                var oValue = idDlgInputTaxoDesc.getTokens()[j].mProperties.text.slice(1);
                                var filtro_ = keysData.filter(e => e.DescTaxonomia === oValue);
                                if (filtro_.length !== 0) {
                                    aToken.push(filtro_[0]);
                                }
                            }
                            localmodel.setProperty("/ModelTaxonomia", aToken);

                        } else {

                            localmodel.setProperty("/ModelTaxonomia", keysData);

                        }

                    }

                    idValueHelpTaxonomia.getTableAsync().then(function (oTable) {
                        var a_Data = [];
                        if(this.getPurchaseOrderInPos() === "ZNM"){
                           var filtro = this.aResultsTaxZNM;
                        
                        
                            filtro.forEach(function (line) {
                                //Se comprueba duplicidad
                                var found = false;
                                for(var i in a_Data){
                                    if(a_Data[i].Code === line.Taxonomia){
                                        found = true;
                                        break;
                                    }
                                }
                                if(!found){
                                    var obj = {
                                        Code: line.Taxonomia,
                                        Description: line.DescTaxonomia
                                    };
                                    a_Data.push(obj);
                                }
                            });
                            localmodel.setProperty("/ModelTaxonomia", a_Data);
                        }
                        oTable.setModel(localmodel, "Taxo");
                        oTable.setModel(oColumnsTaxo, "columns");
                        oTable.bindAggregation("rows", {
                            path: "Taxo>/ModelTaxonomia"
                        });
                    }.bind(this));
                    return;
                }

            },
            //END JMD: ESFU CO124
            setFiltersTaxonomia: function(valueHelp) {
                if(valueHelp.getContent()[0].getItems()[1].getItems()[0].getItems()[0].getFilterGroupItems().length < 3) {  
                    if(!sap.ui.getCore().byId("ControlA_-Idioma")){
                        var FilterLanguage = new sap.ui.comp.filterbar.FilterGroupItem({
                            groupName: "__$INTERNAL$",
                            name: "Idioma",
                            label: "Idioma",
                            control: new sap.m.Input({id: "ControlA_-Idioma", name: "Idioma"})
                        });
                        valueHelp.getContent()[0].getItems()[1].getItems()[0].getItems()[0].addFilterGroupItem(FilterLanguage);
                    }
                }
            },
            setResetTaxonomiaDesc: function (oEvent) {
                var sPath=this.getView().getBindingContext().getPath();
                var oModel=this.getView().getModel();
                if(oModel.getProperty(sPath+"/ZZ1_TAXONOMIA2_PDIT")!==undefined || (oModel.getProperty(sPath+"/ZZ1_TAXONOMIA2_PDIT")===undefined && sPath.includes("PurchaseOrderItem") && sPath.includes("C_PurchaseOrderItemTP"))){
                    oModel.setProperty(sPath+"/ZZ1_TAXONOMIA2_PDIT", "");
                }
            },
            */
            //BEGIN REFACTOR TAXONOMIA - RJV - 05/06/2023

            getColsTaxonomia: function () {
                return {
                    "cols": [{
                        "label": "{i18n>taxonomia}",
                        "template": "ZCDS_F4_RELTAXGRU_CDS>Taxonomia",
                        "width": "8rem"
                    }, {
                        "label": "{i18n>taxonomiadesc}",
                        "template": "ZCDS_F4_RELTAXGRU_CDS>DescTaxonomia",
                        "width": "18rem"
                    }/* ,
                   {
                       "label": "{i18n>grupodearticulos}",
                       "template": "ZCDS_F4_RELTAXGRU_CDS>Matkl",
                       "width": "18rem"
                   } */
                        //    {
                        //        "label": "{i18n>idioma}",
                        //        "template": "ZCDS_F4_RELTAXGRU_CDS>Idioma",
                        //        "width": "18rem"
                        //    }
                    ]
                };
            },
            onValueHelpTaxonomia: function (oEvent) {
                var oColModel = new sap.ui.model.json.JSONModel(this.getColsTaxonomia());
                var sBukrs = this.getView().getBindingContext().getObject().CompanyCode;
                var sBsart = this.getPurchaseOrderInPos();
                this._oBasicSearchField = new sap.m.SearchField({
                    showSearchButton: false
                });
                this._oInput = oEvent.getSource();
                var grupoArt = this.getView().getBindingContext().getObject().MaterialGroup;
                this.getFragment("TaxonomiaValueHelp").then(function (oFragment) {
                    oFragment.getFilterBar().setBasicSearch(this._oBasicSearchField);
                    //oFragment.getTable().setModel(this.getView().getModel("ZCDS_F4_RELTAXGRU_CDS"));
                    oFragment.getTable().setModel(oColModel, "columns");
                    var purchaseOrderType = this.getPurchaseOrderInPos();
                    purchaseOrderType = purchaseOrderType === "ZNM" ? purchaseOrderType : "";
                    if(purchaseOrderType === "ZNM"){
                        oFragment.getFilterBar().setModel(new sap.ui.model.json.JSONModel({ Matkl: grupoArt, Taxonomia: "NM" }), "auxFilter");
                    }else{
                        oFragment.getFilterBar().setModel(new sap.ui.model.json.JSONModel({ Matkl: grupoArt }), "auxFilter");
                    }                    
                    oFragment.getTable().bindRows({
                        path: "ZCDS_F4_RELTAXGRU_CDS>/ZCDS_F4_RELTAXGRU(in_bukrs='" + sBukrs + "',in_bsart='" + sBsart + "',in_Matkl='')/Set",
                    });
                    oFragment.getTable().setSelectionMode("Single");
                    this.getView().byId("ID_Taxonomia").setSupportMultiselect(false);
                    oFragment.open();
                }.bind(this));
            },
            onValueHelpAfterOpenTaxonomia: function (oEvent) {
                oEvent.getSource().getFilterBar().search();
            },
            onValueHelpCancelTaxonomia: function (oEvent) {
                this.getFragment("TaxonomiaValueHelp").then(function (oFragment) {
                    oFragment.close();
                });
            },
            onFilterBarSearchTaxonomia: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue();
                var sBukrs = this.getView().getBindingContext().getObject().CompanyCode;
                var sBsart = this.getPurchaseOrderInPos();
                var sMatkl = '';
                var aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        if (oControl.getName() !== "Matkl") {
                            aResult.push(new sap.ui.model.Filter({
                                path: oControl.getName(),
                                operator: sap.ui.model.FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        } else {
                            sMatkl = oControl.getValue();
                        }
                    }
                    return aResult;
                }, []);
                /*
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "Taxonomia",
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: sSearchQuery
                        })
                    ],
                    and: false
                }));
                this.getFragment("TaxonomiaValueHelp").then(function (oFragment) {
                    oFragment.getTable().getBinding("rows").filter(aFilters);
                });*/
                var purchaseOrderType = this.getPurchaseOrderInPos();
                purchaseOrderType = purchaseOrderType === "ZNM" ? purchaseOrderType : "";
                this.getFragment("TaxonomiaValueHelp").then(function (oFragment) {
                    oFragment.getTable().bindAggregation("rows", {
                        path: "ZCDS_F4_RELTAXGRU_CDS>/ZCDS_F4_RELTAXGRU(in_bukrs='" + sBukrs + "',in_bsart='" + sBsart + "',in_Matkl='" + sMatkl + "')/Set",
                        parameters: {
                            custom: {
                                search: sSearchQuery
                            }
                        },
                        filters: aFilters
                    });
                })
            },
            onValueHelpOkPressTaxonomia: function (oEvent) {
                var that = this;
                if (oEvent.getParameter("tokens")[0]) {
                    var oInput = oEvent.getParameter("tokens")[0].getProperty("key");
                    this._oInput.getModel().setProperty(this._oInput.getBindingContext().getPath() + "/ZZ_TAXONOMIA2", oInput);
                    this._oInput.getModel().submitChanges();
                }

                this.getFragment("TaxonomiaValueHelp").then(function (oFragment) {
                    oFragment.close();
                });
            }
            ,
            //END REFACTOR TAXONOMIA - RJV - 05/06/2023
            oFragments: {},
            getFragment: function (sFragmentName) {
                if (!this.oFragments[sFragmentName]) {
                    this.oFragments[sFragmentName] = sap.ui.xmlfragment(this.getView().getId(), "customer.zmmpomanages1pa.changes.fragments." +
                        sFragmentName, this);
                    this.getView().addDependent(this.oFragments[sFragmentName]);
                }
                return Promise.resolve(this.oFragments[sFragmentName]);
            },
            getColsProfile: function () {
                return {
                    "cols": [
                        {
                            "label": "Id",
                            "template": "oSIMHelp>ZzPerfil",
                            "width": "10rem"
                        }, {
                            "label": "Descripción",
                            "template": "oSIMHelp>ZzPerfildesc"
                        }
                    ]
                };
            },
            onValueHelpProfileSIM: function (oEvent) {
                var oColModel = new sap.ui.model.json.JSONModel(this.getColsProfile());

                this._oBasicSearchField = new sap.m.SearchField({
                    showSearchButton: false
                });
                this._oInput = oEvent.getSource();
                this.getFragment("SIMPerfilValueHelp").then(function (oFragment) {
                    oFragment.getFilterBar().setBasicSearch(this._oBasicSearchField);
                    oFragment.getTable().setModel(this.getView().getModel("oSIMHelp"));
                    oFragment.getTable().setModel(oColModel, "columns");
                    oFragment.getTable().bindRows({
                        path: "oSIMHelp>/ZMM_PERFILESSet"
                    });
                    oFragment.getTable().setSelectionMode("Single");
                    oFragment.open();
                    this.getView().byId("ID_PERFIL").setSupportMultiselect(false);
                }.bind(this));
            },
            onValueHelpCancelPerfil: function (oEvent) {
                this.getFragment("SIMPerfilValueHelp").then(function (oFragment) {
                    oFragment.close();
                });
            },
            onFilterBarSearchPerfil: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue();
                var aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new sap.ui.model.Filter({
                            path: oControl.getName(),
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }

                    return aResult;
                }, []);
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "ZzPerfil",
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: sSearchQuery
                        })
                    ],
                    and: false
                }));

                this.getFragment("SIMPerfilValueHelp").then(function (oFragment) {
                    oFragment.getTable().getBinding("rows").filter(aFilters);
                });
            },
            onValueHelpOkPressPerfil: function (oEvent) {
                var that = this;
                if (oEvent.getParameter("tokens")[0]) {
                    var oInput = oEvent.getParameter("tokens")[0].getProperty("key");
                    this._oInput.getModel().setProperty(this._oInput.getBindingContext().getPath() + "/ZZ_PERFIL", oInput);
                    sessionStorage.setItem("perfil", oInput);
                    this._oInput.getModel().submitChanges();
                } else {
                    //this._oInput.setValue("");
                    //this._oInput.setDescription("");
                    //this._oInput.getModel().setProperty(this._oInput.getBindingContext().getPath()+"/ZZRESP_EM","");
                    //sessionStorage.setItem("responsable","");
                    //this._oInput.getModel().submitChanges();
                }

                this.getFragment("SIMPerfilValueHelp").then(function (oFragment) {
                    // if(oFragment.getTable().getSelectedIndex()){
                    // 	that._iPosition = oFragment.getTable().getSelectedIndex();
                    // 	that._iPosition.toString();
                    // }
                    oFragment.close();
                });
            },
            getColsClase: function () {
                return {
                    "cols": [
                        {
                            "label": "Id",
                            "template": "oSIMHelp>ZzClase",
                            "width": "10rem"
                        }, {
                            "label": "Descripción",
                            "template": "oSIMHelp>ZzClasedesc"
                        }
                    ]
                };
            },
            onValueHelpClaseSIM: function (oEvent) {
                var oColModel = new sap.ui.model.json.JSONModel(this.getColsClase());

                this._oBasicSearchField = new sap.m.SearchField({
                    showSearchButton: false
                });
                this._oInput = oEvent.getSource();
                this.getFragment("SIMClaseValueHelp").then(function (oFragment) {
                    oFragment.getFilterBar().setBasicSearch(this._oBasicSearchField);
                    oFragment.getTable().setModel(this.getView().getModel("oSIMHelp"));
                    oFragment.getTable().setModel(oColModel, "columns");
                    oFragment.getTable().bindRows({
                        path: "oSIMHelp>/ZMM_CLASESSet"
                    });
                    oFragment.getTable().setSelectionMode("Single");
                    oFragment.open();
                    this.getView().byId("ID_CLASE").setSupportMultiselect(false);
                }.bind(this));
            },
            onValueHelpCancelClase: function (oEvent) {
                this.getFragment("SIMClaseValueHelp").then(function (oFragment) {
                    oFragment.close();
                });
            },
            onFilterBarSearchClase: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue();
                var aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new sap.ui.model.Filter({
                            path: oControl.getName(),
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }

                    return aResult;
                }, []);
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "ZzClase",
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: sSearchQuery
                        })
                    ],
                    and: false
                }));

                this.getFragment("SIMClaseValueHelp").then(function (oFragment) {
                    oFragment.getTable().getBinding("rows").filter(aFilters);
                });
            },
            onValueHelpOkPressClase: function (oEvent) {
                var that = this;
                if (oEvent.getParameter("tokens")[0]) {
                    var oInput = oEvent.getParameter("tokens")[0].getProperty("key");
                    this._oInput.getModel().setProperty(this._oInput.getBindingContext().getPath() + "/ZZ_CLASE", oInput);
                    sessionStorage.setItem("clase", oInput);
                    this._oInput.getModel().submitChanges();
                } else {
                }

                this.getFragment("SIMClaseValueHelp").then(function (oFragment) {
                    oFragment.close();
                });
            },
            getColsZona: function () {
                return {
                    "cols": [
                        {
                            "label": "Id",
                            "template": "oSIMHelp>ZzZonas",
                            "width": "10rem"
                        }, {
                            "label": "Descripción",
                            "template": "oSIMHelp>ZzDescripcion"
                        }
                    ]
                };
            },
            onValueHelpZonaSIM: function (oEvent) {
                var oColModel = new sap.ui.model.json.JSONModel(this.getColsZona());

                this._oBasicSearchField = new sap.m.SearchField({
                    showSearchButton: false
                });
                this._oInput = oEvent.getSource();
                this.getFragment("SIMZonaValueHelp").then(function (oFragment) {
                    oFragment.getFilterBar().setBasicSearch(this._oBasicSearchField);
                    oFragment.getTable().setModel(this.getView().getModel("oSIMHelp"));
                    oFragment.getTable().setModel(oColModel, "columns");
                    oFragment.getTable().bindRows({
                        path: "oSIMHelp>/ZMM_ZONASSet"
                    });
                    oFragment.getTable().setSelectionMode("Single");
                    oFragment.open();
                    this.getView().byId("ID_ZONA").setSupportMultiselect(false);
                }.bind(this));
            },
            onValueHelpCancelZona: function (oEvent) {
                this.getFragment("SIMZonaValueHelp").then(function (oFragment) {
                    oFragment.close();
                });
            },
            onFilterBarSearchZona: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue();
                var aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new sap.ui.model.Filter({
                            path: oControl.getName(),
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }

                    return aResult;
                }, []);
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "ZzZonas",
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: sSearchQuery
                        })
                    ],
                    and: false
                }));

                this.getFragment("SIMZonaValueHelp").then(function (oFragment) {
                    oFragment.getTable().getBinding("rows").filter(aFilters);
                });
            },
            onValueHelpOkPressZona: function (oEvent) {
                var that = this;
                if (oEvent.getParameter("tokens")[0]) {
                    var oInput = oEvent.getParameter("tokens")[0].getProperty("key");
                    this._oInput.getModel().setProperty(this._oInput.getBindingContext().getPath() + "/ZZ_ZONA", oInput);
                    sessionStorage.setItem("zona", oInput);
                    this._oInput.getModel().submitChanges();
                } else {
                }

                this.getFragment("SIMZonaValueHelp").then(function (oFragment) {
                    oFragment.close();
                });
            },
            onChangeInputEM: function (oEvent) {
                if (oEvent.getSource().getValue() === "") {
                    oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() + "/ZZ1_RESP_EM", "");
                    sessionStorage.setItem("responsable", "");
                    oEvent.getSource().getModel().submitChanges();
                }
            },
            _validateAlemania: function (sPlant) {
                var oCustomerData = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--customer.zmmpomanages1pa.DatosClienteSubSection");
                if (oCustomerData && sPlant) {
                    if (sPlant && sPlant.includes("DE")) {
                        oCustomerData.setVisible(false)
                    } else {
                        oCustomerData.setVisible(true)
                    }
                }
            },

            _validateAlemaniaHeader: function (sCompanyCode, sPurOrg) {
                var aGermanyCodes = ["1156","1176","1269","1270","1275","1470","1834","1837","1841","1845","1850","1885","1886","1887","1923"];
                var oReu = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderTP--customer.zmmpomanages1pa.DatosREUSection");
                if (sCompanyCode || sPurOrg) {
                    if (aGermanyCodes.includes(sCompanyCode) || aGermanyCodes.includes(sPurOrg)) {
                        oReu.setVisible(false);
                    } else {
                        oReu.setVisible(true);
                    }
                }
            },

            getColsOU: function () {
                return {
                    "cols": [
                        //     {
                        //     "visible": "false",
                        //     "label": "Id",
                        //     "template": "odataHelp>Respymgmtteamid",
                        //     "width": "10rem"
                        // },
                        {
                            "label": "Responsable de EM",
                            "template": "odataHelp>Respymgmtglobalteamid",
                            "width": "10rem"
                        }, {
                            "label": "Descripcion",
                            "template": "odataHelp>Respymgmtteamname"
                        }
                    ]
                };
            },
            onValueHelpOU: function (oEvent) {
                var oColModel = new sap.ui.model.json.JSONModel(this.getColsOU());

                // begin -  Negrete Diego 03.07.2023
                var sBukrs = this.getView().getBindingContext().getObject().CompanyCode;

                if (sBukrs === undefined) {
                    sBukrs = '';
                };
                // end -  Negrete Diego 03.07.2023


                this._oBasicSearchField = new sap.m.SearchField({
                    showSearchButton: false
                });
                this._oInput = oEvent.getSource();
                this.getFragment("OrganizationalUnitValueHelp").then(function (oFragment) {
                    oFragment.getFilterBar().setBasicSearch(this._oBasicSearchField);
                    //oFragment.getTable().setModel(this.getView().getModel("aux"));
                    oFragment.getTable().setModel(this.getView().getModel("odataHelp"));
                    oFragment.getTable().setModel(oColModel, "columns");
                    oFragment.getTable().bindRows({
                        //path: "aux>/YMacthCode2"
                        path: "odataHelp>/MatchCodeResponsableEMSet",
                        filters: [new sap.ui.model.Filter("bukrs", "EQ", sBukrs)]  // - add  -  Negrete Diego 03.07.2023
                    });
                    oFragment.getTable().setSelectionMode("Single");
                    this.getView().byId("ID_OU").setSupportMultiselect(false);
                    oFragment.open();
                }.bind(this));
            },
            onValueHelpCancelOU: function (oEvent) {
                this.getFragment("OrganizationalUnitValueHelp").then(function (oFragment) {
                    oFragment.close();
                });
            },
            onFilterBarSearchOU: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue();
                var aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new sap.ui.model.Filter({
                            path: oControl.getName(),
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }
                    return aResult;
                }, []);
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "Respymgmtglobalteamid",
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: sSearchQuery
                        })
                    ],
                    and: false
                }));

                this.getFragment("OrganizationalUnitValueHelp").then(function (oFragment) {
                    oFragment.getTable().getBinding("rows").filter(aFilters);
                });
            },
            onValueHelpOkPressOU: function (oEvent) {
                if (oEvent.getParameter("tokens")[0]) {
                    var oInput = oEvent.getParameter("tokens")[0].getProperty("key");
                    this._oInput.getModel().setProperty(this._oInput.getBindingContext().getPath() + "/ZZ1_RESP_EM", oInput);
                    sessionStorage.setItem("responsable", oInput);
                    this._oInput.getModel().submitChanges();
                    this.setValueInputContrEM();
                    //this._oInput.setValue(oInput);
                    //this._oInput.setDescription(oEvent.getParameter("tokens")[0].getCustomData()[0].getValue().Respymgmtteamname);
                } else {
                    //this._oInput.setValue("");
                    //this._oInput.setDescription("");
                    //this._oInput.getModel().setProperty(this._oInput.getBindingContext().getPath()+"/ZZRESP_EM","");
                    //sessionStorage.setItem("responsable","");
                    //this._oInput.getModel().submitChanges();
                }

                this.getFragment("OrganizationalUnitValueHelp").then(function (oFragment) {
                    // if(oFragment.getTable().getSelectedIndex()){
                    // 	that._iPosition = oFragment.getTable().getSelectedIndex();
                    // 	that._iPosition.toString();
                    // }
                    oFragment.close();
                });
            },
            // fnFormatEMValue:  function(value){
            //     var oInput = sap.ui.getCore().byId("ui.s2p.mm.profrequisition.maintains1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseReqnItem--customer.ZMMPPRMAINTS1PA.inputContrEM");
            //     if(oInput && value){
            //         var sPath = oInput.getBindingContext().sPath;
            //         var oSolped = oInput.getModel().getProperty(sPath);
            //         return oSolped.ZZ1_RESP_EME_PRIT + " ("+ value + ")";
            //     }
            // },
            onSuggestedItemSelected: function (oEvent) {
                oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().getPath() + "/ZZ1_RESP_EM", oEvent.getParameter("selectedRow").getBindingContext("odataHelp").getObject().Respymgmtteamid);
                sessionStorage.setItem("responsable", oEvent.getParameter("selectedRow").getBindingContext("odataHelp").getObject().Respymgmtteamid);
                oEvent.getSource().getModel().submitChanges();
            },
            _validateCO94HiddenSourceSupply: function (sTypeDocument) {
                let oSectionSourceSupply = sap.ui.getCore().byId("ui.ssuite.s2p.mm.pur.po.manage.st.s1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_PurchaseOrderItemTP--ReferenceObjectsCollectionFacet::Section");
                if (oSectionSourceSupply) {
                    if (sTypeDocument === "ZLT" || sTypeDocument === "ZNM") {
                        oSectionSourceSupply.setVisible(false);
                    } else {
                        oSectionSourceSupply.setVisible(true);
                    }
                }
            },
        });
    });