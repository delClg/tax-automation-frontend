import { styled } from "@stitches/react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import React, { useEffect, useRef, useState } from "react";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const StyledIframe = styled("iframe", {
  border: "none",
  width: "100%",
  height: "100%",
});

function processData(json) {
  let res = {};
  Object.keys(json).map((key) => {
    if (key.startsWith("table") || key === "tax_pay") {
      res[key] = JSON.parse(json[key]);
    } else {
      res[key] = json[key];
    }
  });
  return res;
}

const GSTR9 = React.memo(function GSTR9({ tableData, setPdfMake }) {
  console.log({ R9Data: tableData });
  let {
    gstin,
    table4,
    table5,
    table6,
    table7,
    table8,
    table9,
    table10,
    table11,
    table14,
    table15,
    table16,
    table17,
    table18,
  } = tableData;
  let [iFrameSrc, setIFrameSrc] = useState("");

  var html = htmlToPdfmake(
    `<div style="font-size: 9px; margin-bottom: 5px">
  <div style="text-align: center">
    <h6 style="margin: 5px">Form GSTR-9</h6>
    <p style="font-style: italic; font-weight: lighter">[See rule 80]</p>
    <p style="font-weight: bold">Annual Return</p>
  </div>
  <!-- Table for GSTIN_DETAILS -->
  <table style="width: 100%" border="2" cellpadding="4">
    <tbody>
      <tr>
        <td style="width: 50%">1. Financial Year</td>
        <td style="width: 50%"></td>
      </tr>
      <tr>
        <td style="width: 50%">2. GSTIN</td>
        <td style="width: 50%">${gstin}</td>
      </tr>
      <tr>
        <td style="width: 50%">3(a). Legal name of the registered person</td>
        <td style="width: 50%"></td>
      </tr>
      <tr>
        <td style="width: 50%">3(b). Trade name, if any</td>
        <td style="width: 50%"></td>
      </tr>
    </tbody>
  </table>
  <!-- Table 4-->
  <table
    style="width: 100%"
    border="2"
    data-pdfmake="{'widths':[25,'*',70, 55, 55, 55, 55]}"
  >
    <tbody>
      <tr class="c-row">
        <th>Pt. II</th>
        <th style="text-align: center" colspan="6">
          Details of Outward and inward supplies made during the financial year
        </th>
      </tr>
      <tr>
        <th rowspan="2" class="c-1">Sr. No.</th>
        <th rowspan="2">Nature of Supplies</th>
        <th rowspan="2">Taxable Value</th>
        <th style="text-align: center" colspan="4">(Amount in all tables)</th>
      </tr>
      <tr>
        <th>Central Tax</th>
        <th>State Tax/ UT Tax</th>
        <th>Integrated Tax</th>
        <th>Cess</th>
      </tr>
      <tr>
        <td class="c-1"></td>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
      </tr>
      <tr>
        <td class="c-1">4</td>
        <td style="width: auto; text-align: center" colspan="6">
          Details of advances, inward and made during the financial year on
          which tax is payable
        </td>
      </tr>
      <tr>
        <td class="c-1">A</td>
        <td>Supplies made to un-registered persons (B2C)</td>
        <td>${table4?.b2c?.txval ?? "-"}</td>
        <td>${table4?.b2c?.camt ?? "-"}</td>
        <td>${table4?.b2c?.samt ?? "-"}</td>
        <td>${table4?.b2c?.iamt ?? "-"}</td>
        <td>${table4?.b2c?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">B</td>
        <td>Supplies made to registered persons (B2B)</td>
        <td>${table4?.b2b?.txval ?? "-"}</td>
        <td>${table4?.b2b?.camt ?? "-"}</td>
        <td>${table4?.b2b?.samt ?? "-"}</td>
        <td>${table4?.b2b?.iamt ?? "-"}</td>
        <td>${table4?.b2b?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">C</td>
        <td>
          Zero rated supply (Export) on payment of tax (except supplies to SEZs)
        </td>
        <td>${table4?.exp?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td>${table4?.exp?.iamt ?? "-"}</td>
        <td>${table4?.exp?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">D</td>
        <td>Supply to SEZs on payment of tax</td>
        <td>${table4?.sez?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td>${table4?.sez?.iamt ?? "-"}</td>
        <td>${table4?.sez?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">E</td>
        <td>Deemed Exports</td>
        <td>${table4?.deemed?.txval ?? "-"}</td>
        <td>${table4?.deemed?.camt ?? "-"}</td>
        <td>${table4?.deemed?.samt ?? "-"}</td>
        <td>${table4?.deemed?.iamt ?? "-"}</td>
        <td>${table4?.deemed?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">F</td>
        <td>
          Advances on which tax has been paid but invoice has not been issued
          (not covered under (A) to (E) above)
        </td>
        <td>${table4?.at?.txval ?? "-"}</td>
        <td>${table4?.at?.camt ?? "-"}</td>
        <td>${table4?.at?.samt ?? "-"}</td>
        <td>${table4?.at?.iamt ?? "-"}</td>
        <td>${table4?.at?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">G</td>
        <td>
          Inward supplies on which tax is to be paid on reverse charge basis
        </td>
        <td>${table4?.rchrg?.txval ?? "-"}</td>
        <td>${table4?.rchrg?.camt ?? "-"}</td>
        <td>${table4?.rchrg?.samt ?? "-"}</td>
        <td>${table4?.rchrg?.iamt ?? "-"}</td>
        <td>${table4?.rchrg?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">H</td>
        <td>Sub-total (A to G above)</td>
        <td>${table4?.sub_totalAG?.txval ?? "-"}</td>
        <td>${table4?.sub_totalAG?.camt ?? "-"}</td>
        <td>${table4?.sub_totalAG?.samt ?? "-"}</td>
        <td>${table4?.sub_totalAG?.iamt ?? "-"}</td>
        <td>${table4?.sub_totalAG?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">I</td>
        <td>
          Credit Notes issued in respect of transactions specified in (B) to (E)
          above (-)
        </td>
        <td>${table4?.cr_nt?.txval ?? "-"}</td>
        <td>${table4?.cr_nt?.camt ?? "-"}</td>
        <td>${table4?.cr_nt?.samt ?? "-"}</td>
        <td>${table4?.cr_nt?.iamt ?? "-"}</td>
        <td>${table4?.cr_nt?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">J</td>
        <td>
          Debit Notes issued in respect of transactions specified in (B) to (E)
          above (+)
        </td>
        <td>${table4?.dr_nt?.txval ?? "-"}</td>
        <td>${table4?.dr_nt?.camt ?? "-"}</td>
        <td>${table4?.dr_nt?.samt ?? "-"}</td>
        <td>${table4?.dr_nt?.iamt ?? "-"}</td>
        <td>${table4?.dr_nt?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">K</td>
        <td>Supplies / tax declared through Amendments (+)</td>
        <td>${table4?.amd_pos?.txval ?? "-"}</td>
        <td>${table4?.amd_pos?.camt ?? "-"}</td>
        <td>${table4?.amd_pos?.samt ?? "-"}</td>
        <td>${table4?.amd_pos?.iamt ?? "-"}</td>
        <td>${table4?.amd_pos?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">L</td>
        <td>Supplies / tax reduced through Amendments (-)</td>
        <td>${table4?.amd_neg?.txval ?? "-"}</td>
        <td>${table4?.amd_neg?.camt ?? "-"}</td>
        <td>${table4?.amd_neg?.samt ?? "-"}</td>
        <td>${table4?.amd_neg?.iamt ?? "-"}</td>
        <td>${table4?.amd_neg?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">M</td>
        <td>Sub-total (I to L above)</td>
        <td>${table4?.sub_totalIL?.txval ?? "-"}</td>
        <td>${table4?.sub_totalIL?.camt ?? "-"}</td>
        <td>${table4?.sub_totalIL?.samt ?? "-"}</td>
        <td>${table4?.sub_totalIL?.iamt ?? "-"}</td>
        <td>${table4?.sub_totalIL?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">N</td>
        <td>Supplies and advances on which tax is to be paid (H + M) above</td>
        <td>${table4?.sup_adv?.txval ?? "-"}</td>
        <td>${table4?.sup_adv?.camt ?? "-"}</td>
        <td>${table4?.sup_adv?.samt ?? "-"}</td>
        <td>${table4?.sup_adv?.iamt ?? "-"}</td>
        <td>${table4?.sup_adv?.csamt ?? "-"}</td>
      </tr>
    </tbody>
  </table>
  <!-- Table 5 -->
  <table
    style="width: 100%"
    border="2"
    data-pdfmake="{'widths':[25,'*',70, 55, 55, 55, 55]}"
  >
    <tbody>
      <tr class="c-row">
        <th class="c-1">5</th>
        <th style="text-align: center; font-weight: bold" colspan="6">
          Details of Outward supplies on which tax is not payable as declared in
          returns filed during the financial year
        </th>
      </tr>
      <tr>
        <td class="c-1">A</td>
        <td>Zero rated supply (Export) without payment of tax</td>
        <td>${table5?.zero_rtd?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">B</td>
        <td>Supply to SEZs without payment of tax</td>
        <td>${table5?.sez?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">C</td>
        <td>
          Supplies on which tax is to be paid by the recipient on reverse charge
          basis
        </td>
        <td>${table5?.rchrg?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">D</td>
        <td>Exempted</td>
        <td>${table5?.exmt?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">E</td>
        <td>Nil Rated</td>
        <td>${table5?.nil?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">F</td>
        <td>Non-GST supply</td>
        <td>${table5?.non_gst?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr class="c-row">
        <td class="c-1">G</td>
        <td>Sub-total (A to F above)</td>
        <td>${table5?.sub_totalAF?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">H</td>
        <td>
          Credit Notes issued in respect of transactions specified in A to F
          above (-)
        </td>
        <td>${table5?.cr_nt?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">I</td>
        <td>
          Debit Notes issued in respect of transactions specified in A to F
          above (+)
        </td>
        <td>${table5?.dr_nt?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">J</td>
        <td>Supplies declared through Amendments (+)</td>
        <td>${table5?.amd_pos?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">K</td>
        <td>Supplies reduced through Amendments (-)</td>
        <td>${table5?.amd_neg?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr class="c-row">
        <td class="c-1">L</td>
        <td>Sub-Total (H to K above)</td>
        <td>${table5?.sub_totalHK?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr class="c-row">
        <td class="c-1">M</td>
        <td>${table5?.tover_tax_np?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr class="c-row">
        <td class="c-1">N</td>
        <td>Total Turnover (including advances) (4N + 5M - 4G above)</td>
        <td>${table5?.total_tover?.txval ?? "-"}</td>
        <td>${table5?.total_tover?.camt ?? "-"}</td>
        <td>${table5?.total_tover?.samt ?? "-"}</td>
        <td>${table5?.total_tover?.iamt ?? "-"}</td>
        <td>${table5?.total_tover?.csamt ?? "-"}</td>
      </tr>
    </tbody>
  </table>
  <!-- Table 6 With Pt.III format -->
  <table
    style="width: 100%"
    border="2"
    data-pdfmake="{'widths':[25,'*',70, 55, 55, 55, 55]}"
  >
    <tbody>
      <tr class="c-row">
        <th class="c-1">Pt. III</th>
        <th style="text-align: center; font-weight: bold" colspan="6">
          Details of ITC as declared in returns filed during the financial year
        </th>
      </tr>
      <tr>
        <td rowspan="2"></td>
        <td>Description</td>
        <td>Type</td>
        <td>Central Tax</td>
        <td>State Tax / UT Tax</td>
        <td>State Tax / UT Tax</td>
        <td>Cess</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
      </tr>
      <tr>
        <th class="c-1">6</th>
        <th style="text-align: center; font-weight: bold" colspan="6">
          Details of ITC as declared in returns filed during the financial year
        </th>
      </tr>
      <tr>
        <td class="c-1">A</td>
        <td colspan="2">
          Total amount of input tax credit availed through FORM GSTR-3B (sum
          total of Table 4A of FORM GSTR-3B)
        </td>
        <td>${table6?.itc_3b?.camt ?? "-"}</td>
        <td>${table6?.itc_3b?.samt ?? "-"}</td>
        <td>${table6?.itc_3b?.iamt ?? "-"}</td>
        <td>${table6?.itc_3b?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1" rowspan="3">B</td>
        <td rowspan="3">
          Inward supplies (other than imports and inward supplies liable to
          reverse charge but includes services received from SEZs)
        </td>
        <td>Inputs</td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "ip")[0]
              ?.camt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "ip")[0]
              ?.samt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "ip")[0]
              ?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "ip")[0]
              ?.csamt ?? "-"
          }
        </td>
      </tr>
      <tr>
        <td>Capital Goods</td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "cg")[0]
              ?.camt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "cg")[0]
              ?.samt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "cg")[0]
              ?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "cg")[0]
              ?.csamt ?? "-"
          }
        </td>
      </tr>
      <tr>
        <td>Input Services</td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "is")[0]
              ?.camt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "is")[0]
              ?.samt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "is")[0]
              ?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_non_rchrg?.filter(({ itc_typ }) => itc_typ == "is")[0]
              ?.csamt ?? "-"
          }
        </td>
      </tr>
      <tr>
        <td class="c-1" rowspan="3">C</td>
        <td rowspan="3">
          Inward supplies received from unregistered persons liable to reverse
          charge (other than B above) on which tax is paid & ITC availed
        </td>
        <td>Inputs</td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "ip"
            )[0]?.camt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "ip"
            )[0]?.samt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "ip"
            )[0]?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "ip"
            )[0]?.csamt ?? "-"
          }
        </td>
      </tr>
      <tr>
        <td>Capital Goods</td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "cg"
            )[0]?.camt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "cg"
            )[0]?.samt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "cg"
            )[0]?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "cg"
            )[0]?.csamt ?? "-"
          }
        </td>
      </tr>
      <tr>
        <td>Input Services</td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "is"
            )[0]?.camt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "is"
            )[0]?.samt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "is"
            )[0]?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_unreg?.filter(
              ({ itc_typ }) => itc_typ == "is"
            )[0]?.csamt ?? "-"
          }
        </td>
      </tr>
      <tr>
        <td class="c-1" rowspan="3">D</td>
        <td rowspan="3">
          Inward supplies received from registered persons liable to reverse
          charge (other than B above) on which tax is paid and ITC availed
        </td>
        <td>Inputs</td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "ip")[0]
              ?.camt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "ip")[0]
              ?.samt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "ip")[0]
              ?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "ip")[0]
              ?.csamt ?? "-"
          }
        </td>
      </tr>
      <tr>
        <td>Capital Goods</td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "cg")[0]
              ?.camt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "cg")[0]
              ?.samt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "cg")[0]
              ?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "cg")[0]
              ?.csamt ?? "-"
          }
        </td>
      </tr>
      <tr>
        <td>Input Services</td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "is")[0]
              ?.camt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "is")[0]
              ?.samt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "is")[0]
              ?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6?.supp_rchrg_reg?.filter(({ itc_typ }) => itc_typ == "is")[0]
              ?.csamt ?? "-"
          }
        </td>
      </tr>
      <tr>
        <td class="c-1" rowspan="2">E</td>
        <td rowspan="2">Import of goods (including supplies from SEZs)</td>
        <td>Inputs</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td>
          ${
            table6.iog?.filter(({ itc_typ }) => itc_typ == "ip")[0]?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6.iog?.filter(({ itc_typ }) => itc_typ == "ip")[0]?.csamt ??
            "-"
          }
        </td>
      </tr>
      <tr>
        <td>Capital Goods</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td>
          ${
            table6.iog?.filter(({ itc_typ }) => itc_typ == "cg")[0]?.iamt ?? "-"
          }
        </td>
        <td>
          ${
            table6.iog?.filter(({ itc_typ }) => itc_typ == "cg")[0]?.csamt ??
            "-"
          }
        </td>
      </tr>
      <tr>
        <td class="c-1">F</td>
        <td colspan="2">
          Import of services (excluding inward supplies from SEZs)
        </td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td>${table6?.ios?.iamt ?? "-"}</td>
        <td>${table6?.ios?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">G</td>
        <td colspan="2">Input Tax credit received from ISD</td>
        <td>${table6?.isd?.camt ?? "-"}</td>
        <td>${table6?.isd?.samt ?? "-"}</td>
        <td>${table6?.isd?.iamt ?? "-"}</td>
        <td>${table6?.isd?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">H</td>
        <td colspan="2">
          Amount of ITC reclaimed (other than B above) under the provisions of
          the Act
        </td>
        <td>${table6?.itc_clmd?.camt ?? "-"}</td>
        <td>${table6?.itc_clmd?.samt ?? "-"}</td>
        <td>${table6?.itc_clmd?.iamt ?? "-"}</td>
        <td>${table6?.itc_clmd?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">I</td>
        <td colspan="2">Sub-total (B to H above)</td>
        <td>${table6?.sub_totalBH?.camt ?? "-"}</td>
        <td>${table6?.sub_totalBH?.samt ?? "-"}</td>
        <td>${table6?.sub_totalBH?.iamt ?? "-"}</td>
        <td>${table6?.sub_totalBH?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">J</td>
        <td colspan="2">Difference (I - A above)</td>
        <td>${table6?.difference?.camt ?? "-"}</td>
        <td>${table6?.difference?.samt ?? "-"}</td>
        <td>${table6?.difference?.iamt ?? "-"}</td>
        <td>${table6?.difference?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">K</td>
        <td colspan="2">
          Transition Credit through TRAN-I (including revisions if any)
        </td>
        <td>${table6?.tran1?.camt ?? "-"}</td>
        <td>${table6?.tran1?.samt ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">L</td>
        <td colspan="2">Transition Credit through TRAN-II</td>
        <td>${table6?.tran2?.camt ?? "-"}</td>
        <td>${table6?.tran2?.samt ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr class="c-row">
        <td class="c-1">M</td>
        <td colspan="2">Any other ITC availed but not specified above</td>
        <td>${table6?.other?.camt ?? "-"}</td>
        <td>${table6?.other?.samt ?? "-"}</td>
        <td>${table6?.other?.iamt ?? "-"}</td>
        <td>${table6?.other?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">N</td>
        <td colspan="2">Sub-total (K to M above)</td>
        <td>${table6?.sub_totalKM?.camt ?? "-"}</td>
        <td>${table6?.sub_totalKM?.samt ?? "-"}</td>
        <td>${table6?.sub_totalKM?.iamt ?? "-"}</td>
        <td>${table6?.sub_totalKM?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">O</td>
        <td colspan="2">Total ITC availed (I + N above)</td>
        <td>${table6?.total_itc_availed?.camt ?? "-"}</td>
        <td>${table6?.total_itc_availed?.samt ?? "-"}</td>
        <td>${table6?.total_itc_availed?.iamt ?? "-"}</td>
        <td>${table6?.total_itc_availed?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <th class="c-1">7</th>
        <th style="text-align: center; font-weight: bold" colspan="6">
          Details of ITC Reversed and Ineligible ITC as declared in returns
          filed during the financial year
        </th>
      </tr>
      <tr>
        <td class="c-1">A</td>
        <td colspan="2">As per Rule 37</td>
        <td>${table7?.rule37?.camt ?? "-"}</td>
        <td>${table7?.rule37?.samt ?? "-"}</td>
        <td>${table7?.rule37?.iamt ?? "-"}</td>
        <td>${table7?.rule37?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">B</td>
        <td colspan="2">As per Rule 39</td>
        <td>${table7?.rule39?.camt ?? "-"}</td>
        <td>${table7?.rule39?.samt ?? "-"}</td>
        <td>${table7?.rule39?.iamt ?? "-"}</td>
        <td>${table7?.rule39?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">C</td>
        <td colspan="2">As per Rule 42</td>
        <td>${table7?.rule42?.camt ?? "-"}</td>
        <td>${table7?.rule42?.samt ?? "-"}</td>
        <td>${table7?.rule42?.iamt ?? "-"}</td>
        <td>${table7?.rule42?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">D</td>
        <td colspan="2">As per Rule 43</td>
        <td>${table7?.rule43?.camt ?? "-"}</td>
        <td>${table7?.rule43?.samt ?? "-"}</td>
        <td>${table7?.rule43?.iamt ?? "-"}</td>
        <td>${table7?.rule43?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">E</td>
        <td colspan="2">As per section 17(5)</td>
        <td>${table7?.sec17?.camt ?? "-"}</td>
        <td>${table7?.sec17?.samt ?? "-"}</td>
        <td>${table7?.sec17?.iamt ?? "-"}</td>
        <td>${table7?.sec17?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">F</td>
        <td colspan="2">Reversal of TRAN-I credit</td>
        <td>${table7?.revsl_tran1?.camt ?? "-"}</td>
        <td>${table7?.revsl_tran1?.samt ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">G</td>
        <td colspan="2">Reversal of TRAN-II credit</td>
        <td>${table7?.revsl_tran2?.camt ?? "-"}</td>
        <td>${table7?.revsl_tran2?.samt ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">H</td>
        <td colspan="2">Other reversals (pl. specify)</td>
        <td>${table7?.other?.camt ?? "-"}</td>
        <td>${table7?.other?.samt ?? "-"}</td>
        <td>${table7?.other?.iamt ?? "-"}</td>
        <td>${table7?.other?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">I</td>
        <td colspan="2">Total ITC Reversed (A to H above)</td>
        <td>${table7?.tot_itc_revd?.camt ?? "-"}</td>
        <td>${table7?.tot_itc_revd?.samt ?? "-"}</td>
        <td>${table7?.tot_itc_revd?.iamt ?? "-"}</td>
        <td>${table7?.tot_itc_revd?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">J</td>
        <td colspan="2">Net ITC Available for Utilization (6O - 7I)</td>
        <td>${table7?.net_itc_aval?.camt ?? "-"}</td>
        <td>${table7?.net_itc_aval?.samt ?? "-"}</td>
        <td>${table7?.net_itc_aval?.iamt ?? "-"}</td>
        <td>${table7?.net_itc_aval?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <th class="c-1">8</th>
        <th style="text-align: center; font-weight: bold" colspan="6">
          Other ITC related information
        </th>
      </tr>
      <tr>
        <td class="c-1">A</td>
        <td colspan="2">ITC as per GSTR-2A (Table 3 & 5 thereof)</td>
        <td>${table8?.itc_2a?.camt ?? "-"}</td>
        <td>${table8?.itc_2a?.samt ?? "-"}</td>
        <td>${table8?.itc_2a?.iamt ?? "-"}</td>
        <td>${table8?.itc_2a?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">B</td>
        <td colspan="2">ITC as per sum total of 6(B) and 6(H) above</td>
        <td>${table8?.itc_tot?.camt ?? "-"}</td>
        <td>${table8?.itc_tot?.samt ?? "-"}</td>
        <td>${table8?.itc_tot?.iamt ?? "-"}</td>
        <td>${table8?.itc_tot?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">C</td>
        <td colspan="2">
          ITC on inward supplies (other than imports and inward supplies liable
          to reverse charge but includes services received from SEZs) received
          during 2017-18 but availed during April to September, 2018
        </td>
        <td>${table8?.itc_inwd_supp?.camt ?? "-"}</td>
        <td>${table8?.itc_inwd_supp?.samt ?? "-"}</td>
        <td>${table8?.itc_inwd_supp?.iamt ?? "-"}</td>
        <td>${table8?.itc_inwd_supp?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">D</td>
        <td colspan="2">Difference [A-(B+C)]</td>
        <td>${table8?.differenceABC?.camt ?? "-"}</td>
        <td>${table8?.differenceABC?.samt ?? "-"}</td>
        <td>${table8?.differenceABC?.iamt ?? "-"}</td>
        <td>${table8?.differenceABC?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">E</td>
        <td colspan="2">ITC available but not availed (out of D)</td>
        <td>${table8?.itc_nt_availd?.camt ?? "-"}</td>
        <td>${table8?.itc_nt_availd?.samt ?? "-"}</td>
        <td>${table8?.itc_nt_availd?.iamt ?? "-"}</td>
        <td>${table8?.itc_nt_availd?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">F</td>
        <td colspan="2">ITC available but ineligible (out of D)</td>
        <td>${table8?.itc_nt_eleg?.camt ?? "-"}</td>
        <td>${table8?.itc_nt_eleg?.samt ?? "-"}</td>
        <td>${table8?.itc_nt_eleg?.iamt ?? "-"}</td>
        <td>${table8?.itc_nt_eleg?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">G</td>
        <td colspan="2">
          IGST paid on import of goods (including supplies from SEZ)
        </td>
        <td>${table8?.iog_taxpaid?.camt ?? "-"}</td>
        <td>${table8?.iog_taxpaid?.samt ?? "-"}</td>
        <td>${table8?.iog_taxpaid?.iamt ?? "-"}</td>
        <td>${table8?.iog_taxpaid?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">H</td>
        <td colspan="2">
          IGST credit availed on import of goods (as per 6(E) above)
        </td>
        <td>${table8?.iog_itc_availd?.camt ?? "-"}</td>
        <td>${table8?.iog_itc_availd?.samt ?? "-"}</td>
        <td>${table8?.iog_itc_availd?.iamt ?? "-"}</td>
        <td>${table8?.iog_itc_availd?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">I</td>
        <td colspan="2">Difference (G-H)</td>
        <td>${table8?.differenceGH?.camt ?? "-"}</td>
        <td>${table8?.differenceGH?.samt ?? "-"}</td>
        <td>${table8?.differenceGH?.iamt ?? "-"}</td>
        <td>${table8?.differenceGH?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">J</td>
        <td colspan="2">
          ITC available but not availed on import of goods (Equal to I)
        </td>
        <td>${table8?.iog_itc_ntavaild?.camt ?? "-"}</td>
        <td>${table8?.iog_itc_ntavaild?.samt ?? "-"}</td>
        <td>${table8?.iog_itc_ntavaild?.iamt ?? "-"}</td>
        <td>${table8?.iog_itc_ntavaild?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <td class="c-1">K</td>
        <td colspan="2">
          Total ITC to be lapsed in current financial year (E + F + J)
        </td>
        <td>${table8?.tot_itc_lapsed?.camt ?? "-"}</td>
        <td>${table8?.tot_itc_lapsed?.samt ?? "-"}</td>
        <td>${table8?.tot_itc_lapsed?.iamt ?? "-"}</td>
        <td>${table8?.tot_itc_lapsed?.csamt ?? "-"}</td>
      </tr>
    </tbody>
  </table>
  <table
    style="width: 100%"
    border="2"
    data-pdfmake="{'widths':[25,'*',55, 55, 55, 55, 55, 55]}"
  >
    <tbody>
      <tr class="c-row">
        <th class="c-1">Pt. IV</th>
        <th style="text-align: center" colspan="7">
          Details of tax paid as declared in returns filed during the financial
          year
        </th>
      </tr>
      <tr>
        <th rowspan="2" class="c-1">9</th>
        <th rowspan="2">Description</th>
        <th rowspan="2">Tax Payable</th>
        <th rowspan="2">Paid through cash</th>
        <th style="text-align: center" colspan="4">Paid through ITC</th>
      </tr>
      <tr>
        <th>Central Tax</th>
        <th>State Tax/ UT Tax</th>
        <th>Integrated Tax</th>
        <th>Cess</th>
      </tr>
      <tr>
        <td class="c-1" rowspan="9"></td>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
        <td>7</td>
      </tr>
      <tr>
        <td>Integrated Tax</td>
        <td>${table9?.iamt?.txpyble ?? "-"}</td>
        <td>${table9?.iamt?.txpaid_cash ?? "-"}</td>
        <td>${table9?.iamt?.tax_paid_itc_camt ?? "-"}</td>
        <td>${table9?.iamt?.tax_paid_itc_samt ?? "-"}</td>
        <td>${table9?.iamt?.tax_paid_itc_iamt ?? "-"}</td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td>Central Tax</td>
        <td>${table9?.camt?.txpyble ?? "-"}</td>
        <td>${table9?.camt?.txpaid_cash ?? "-"}</td>
        <td>${table9?.camt?.tax_paid_itc_camt ?? "-"}</td>
        <td class="n-a"></td>
        <td>${table9?.camt?.tax_paid_itc_iamt ?? "-"}</td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td>State/UT Tax</td>
        <td>${table9?.samt?.txpyble ?? "-"}</td>
        <td>${table9?.samt?.txpaid_cash ?? "-"}</td>
        <td class="n-a"></td>
        <td>${table9?.samt?.tax_paid_itc_samt ?? "-"}</td>
        <td>${table9?.samt?.tax_paid_itc_iamt ?? "-"}</td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td>Cess</td>
        <td>${table9?.csamt?.txpyble ?? "-"}</td>
        <td>${table9?.csamt?.txpaid_cash ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td>${table9?.csamt?.tax_paid_itc_csamt ?? "-"}</td>
      </tr>
      <tr>
        <td>Interest</td>
        <td>${table9?.intr?.txpyble ?? "-"}</td>
        <td>${table9?.intr?.txpaid_cash ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td>Late fee</td>
        <td>${table9?.fee?.txpyble ?? "-"}</td>
        <td>${table9?.fee?.txpaid_cash ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td>Penalty</td>
        <td>${table9?.pen?.txpyble ?? "-"}</td>
        <td>${table9?.pen?.txpaid_cash ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td>Other</td>
        <td>${table9?.other?.txpyble ?? "-"}</td>
        <td>${table9?.other?.txpaid_cash ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
    </tbody>
  </table>
  <table
    style="width: 100%"
    border="2"
    data-pdfmake="{'widths':[25,'*', 55, 55, 55, 55, 55]}"
  >
    <tbody>
      <tr class="c-row">
        <th class="c-1">Pt. V</th>
        <th style="text-align: center" colspan="6">
          Particulars of the transactions for the previous FY declared in
          returns of April to September of current FY or upto date of filing of
          annual return of previous FY whichever is earlier
        </th>
      </tr>
      <tr>
        <td rowspan="2"></td>
        <td>Description</td>
        <td>Taxable Value</td>
        <td>Central Tax</td>
        <td>State Tax / UT Tax</td>
        <td>Integrated Tax</td>
        <td>Cess</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
      </tr>
      <tr>
        <td><strong>10</strong></td>
        <td>
          Supplies / tax declared through Amendments (+) (net of debit notes)
        </td>
        <td>${table10?.dbn_amd?.txval ?? "-"}</td>
        <td>${table10?.dbn_amd?.camt ?? "-"}</td>
        <td>${table10?.dbn_amd?.samt ?? "-"}</td>
        <td>${table10?.dbn_amd?.iamt ?? "-"}</td>
        <td>${table10?.dbn_amd?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td><strong>11</strong></td>
        <td>
          Supplies / tax reduced through Amendments (-) (net of credit notes)
        </td>
        <td>${table10?.cdn_amd?.txval ?? "-"}</td>
        <td>${table10?.cdn_amd?.camt ?? "-"}</td>
        <td>${table10?.cdn_amd?.samt ?? "-"}</td>
        <td>${table10?.cdn_amd?.iamt ?? "-"}</td>
        <td>${table10?.cdn_amd?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td><strong>12</strong></td>
        <td>Reversal of ITC availed during previous financial year</td>
        <td>${table10?.itc_rvsl?.txval ?? "-"}</td>
        <td>${table10?.itc_rvsl?.camt ?? "-"}</td>
        <td>${table10?.itc_rvsl?.samt ?? "-"}</td>
        <td>${table10?.itc_rvsl?.iamt ?? "-"}</td>
        <td>${table10?.itc_rvsl?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td><strong>13</strong></td>
        <td>ITC availed for the previous financial year</td>
        <td>${table10?.rtc_availd?.txval ?? "-"}</td>
        <td>${table10?.rtc_availd?.camt ?? "-"}</td>
        <td>${table10?.rtc_availd?.samt ?? "-"}</td>
        <td>${table10?.rtc_availd?.iamt ?? "-"}</td>
        <td>${table10?.rtc_availd?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td>14</td>
        <td style="text-align: center" colspan="6">
          Differential tax paid on account of declaration in 10 & 11 above
        </td>
      </tr>
      <tr>
        <td rowspan="2"></td>
        <td colspan="2">Description</td>
        <td colspan="2">Payable</td>
        <td colspan="2">Paid</td>
      </tr>
      <tr>
        <td colspan="2">1</td>
        <td colspan="2">2</td>
        <td colspan="2">3</td>
      </tr>
      <tr>
        <td rowspan="5"></td>
        <td colspan="2">Integrated Tax</td>
        <td colspan="2">${table14?.iamt?.txpyble ?? "-"}</td>
        <td colspan="2">${table14?.iamt?.txpaid ?? "-"}</td>
      </tr>
      <tr>
        <td colspan="2">Central Tax</td>
        <td colspan="2">${table14?.camt?.txpyble ?? "-"}</td>
        <td colspan="2">${table14?.camt?.txpaid ?? "-"}</td>
      </tr>
      <tr>
        <td colspan="2">State/UT Tax</td>
        <td colspan="2">${table14?.samt?.txpyble ?? "-"}</td>
        <td colspan="2">${table14?.samt?.txpaid ?? "-"}</td>
      </tr>
      <tr>
        <td colspan="2">Cess</td>
        <td colspan="2">${table14?.csamt?.txpyble ?? "-"}</td>
        <td colspan="2">${table14?.csamt?.txpaid ?? "-"}</td>
      </tr>
      <tr>
        <td colspan="2">Interest</td>
        <td colspan="2">${table14?.intr?.txpyble ?? "-"}</td>
        <td colspan="2">${table14?.intr?.txpaid ?? "-"}</td>
      </tr>
    </tbody>
  </table>
  <table
    style="width: 100%"
    border="2"
    data-pdfmake="{'widths':[25,'*', 35, 35, 35, 35, 35, 35, 35]}"
  >
    <tbody>
      <tr class="c-row">
        <th class="c-1">Pt. VI</th>
        <th style="text-align: center" colspan="8">Other Information</th>
      </tr>
      <tr class="c-row">
        <th class="c-1">15</th>
        <th style="text-align: center" colspan="8">
          Particulars of Demands and Refunds
        </th>
      </tr>
      <tr>
        <td rowspan="2"></td>
        <td>Details</td>
        <td>Central Tax</td>
        <td>State Tax / UT Tax</td>
        <td>Integrated Tax</td>
        <td>Cess</td>
        <td>Interest</td>
        <td>Penalty</td>
        <td>Late Fee / Others</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
        <td>7</td>
        <td>8</td>
      </tr>
      <tr>
        <td class="c-1">A</td>
        <td>Total Refund claimed</td>
        <td>${table15?.rfd_clmd?.camt ?? "-"}</td>
        <td>${table15?.rfd_clmd?.samt ?? "-"}</td>
        <td>${table15?.rfd_clmd?.iamt ?? "-"}</td>
        <td>${table15?.rfd_clmd?.csamt ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">B</td>
        <td>Total Refund sanctioned</td>
        <td>${table15?.rfd_sanc?.camt ?? "-"}</td>
        <td>${table15?.rfd_sanc?.samt ?? "-"}</td>
        <td>${table15?.rfd_sanc?.iamt ?? "-"}</td>
        <td>${table15?.rfd_sanc?.csamt ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">C</td>
        <td>Total Refund Rejected</td>
        <td>${table15?.rfd_rejt?.camt ?? "-"}</td>
        <td>${table15?.rfd_rejt?.samt ?? "-"}</td>
        <td>${table15?.rfd_rejt?.iamt ?? "-"}</td>
        <td>${table15?.rfd_rejt?.csamt ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">D</td>
        <td>Total Refund Pending</td>
        <td>${table15?.rfd_pend?.camt ?? "-"}</td>
        <td>${table15?.rfd_pend?.samt ?? "-"}</td>
        <td>${table15?.rfd_pend?.iamt ?? "-"}</td>
        <td>${table15?.rfd_pend?.csamt ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">E</td>
        <td>Total demand of taxes</td>
        <td>${table15?.tax_dmnd?.camt ?? "-"}</td>
        <td>${table15?.tax_dmnd?.samt ?? "-"}</td>
        <td>${table15?.tax_dmnd?.iamt ?? "-"}</td>
        <td>${table15?.tax_dmnd?.csamt ?? "-"}</td>
        <td>${table15?.tax_dmnd?.intr ?? "-"}</td>
        <td>${table15?.tax_dmnd?.pen ?? "-"}</td>
        <td>${table15?.tax_dmnd?.fee ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">F</td>
        <td>Total taxes paid in respect of E above</td>
        <td>${table15?.tax_paid?.camt ?? "-"}</td>
        <td>${table15?.tax_paid?.samt ?? "-"}</td>
        <td>${table15?.tax_paid?.iamt ?? "-"}</td>
        <td>${table15?.tax_paid?.csamt ?? "-"}</td>
        <td>${table15?.tax_paid?.intr ?? "-"}</td>
        <td>${table15?.tax_paid?.pen ?? "-"}</td>
        <td>${table15?.tax_paid?.fee ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">G</td>
        <td>Total demands pending out of E above</td>
        <td>${table15?.dmnd_pend?.camt ?? "-"}</td>
        <td>${table15?.dmnd_pend?.samt ?? "-"}</td>
        <td>${table15?.dmnd_pend?.iamt ?? "-"}</td>
        <td>${table15?.dmnd_pend?.csamt ?? "-"}</td>
        <td>${table15?.dmnd_pend?.intr ?? "-"}</td>
        <td>${table15?.dmnd_pend?.pen ?? "-"}</td>
        <td>${table15?.dmnd_pend?.fee ?? "-"}</td>
      </tr>
      <tr>
        <th class="c-1">16</th>
        <th style="text-align: center" colspan="8">
          Information on supplies received from composition taxpayers, deemed
          supply under section 143 and goods sent on approval basis
        </th>
      </tr>
      <tr>
        <td rowspan="2"></td>
        <td colspan="3">Details</td>
        <td>Taxable Value</td>
        <td>Central Tax</td>
        <td>State Tax / UT Tax</td>
        <td>Integrated Tax</td>
        <td>Cess</td>
      </tr>
      <tr>
        <td colspan="3">1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
      </tr>
      <tr>
        <td class="c-1">A</td>
        <td colspan="3">Supplies received from Composition taxpayers</td>
        <td>${table16?.comp_supp?.txval ?? "-"}</td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
        <td class="n-a"></td>
      </tr>
      <tr>
        <td class="c-1">B</td>
        <td colspan="3">Deemed supply under Section 143</td>
        <td>${table16?.deemed_supp?.txval ?? "-"}</td>
        <td>${table16?.deemed_supp?.camt ?? "-"}</td>
        <td>${table16?.deemed_supp?.samt ?? "-"}</td>
        <td>${table16?.deemed_supp?.iamt ?? "-"}</td>
        <td>${table16?.deemed_supp?.csamt ?? "-"}</td>
      </tr>
      <tr>
        <td class="c-1">C</td>
        <td colspan="3">Goods sent on approval basis but not returned</td>
        <td>${table16?.not_returned?.txval ?? "-"}</td>
        <td>${table16?.not_returned?.camt ?? "-"}</td>
        <td>${table16?.not_returned?.samt ?? "-"}</td>
        <td>${table16?.not_returned?.iamt ?? "-"}</td>
        <td>${table16?.not_returned?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <th class="c-1">17</th>
        <th style="text-align: center" colspan="8">
          HSN Wise Summary of outward supplies
        </th>
      </tr>
      <tr>
        <td class="c-1">HSN Code</td>
        <td>UQC</td>
        <td>Total Quantity</td>
        <td>Taxable Value</td>
        <td>Rate of Tax</td>
        <td>Central Tax</td>
        <td>State Tax / UT Tax</td>
        <td>Integrated Tax</td>
        <td>Cess</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
        <td>7</td>
        <td>8</td>
        <td>9</td>
      </tr>
      <td>${table17?.items?.hsn_sc ?? "-"}</td>
      <td>${table17?.items?.uqc ?? "-"}</td>
      <td>${table17?.items?.qty ?? "-"}</td>
      <td>${table17?.items?.txval ?? "-"}</td>
      <td>${table17?.items?.rt ?? "-"}</td>
      <td>${table17?.items?.camt ?? "-"}</td>
      <td>${table17?.items?.samt ?? "-"}</td>
      <td>${table17?.items?.iamt ?? "-"}</td>
      <td>${table17?.items?.csamt ?? "-"}</td>
      <tr class="c-row">
        <th class="c-1">18</th>
        <th style="text-align: center" colspan="8">
          HSN Wise Summary of Inward supplies
        </th>
      </tr>
      <tr>
        <td class="c-1">HSN Code</td>
        <td>UQC</td>
        <td>Total Quantity</td>
        <td>Taxable Value</td>
        <td>Rate of Tax</td>
        <td>Central Tax</td>
        <td>State Tax / UT Tax</td>
        <td>Integrated Tax</td>
        <td>Cess</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
        <td>7</td>
        <td>8</td>
        <td>9</td>
      </tr>
      <tr>
        <td>${table18?.items?.hsn_sc ?? "-"}</td>
        <td>${table18?.items?.uqc ?? "-"}</td>
        <td>${table18?.items?.qty ?? "-"}</td>
        <td>${table18?.items?.txval ?? "-"}</td>
        <td>${table18?.items?.rt ?? "-"}</td>
        <td>${table18?.items?.camt ?? "-"}</td>
        <td>${table18?.items?.samt ?? "-"}</td>
        <td>${table18?.items?.iamt ?? "-"}</td>
        <td>${table18?.items?.csamt ?? "-"}</td>
      </tr>
      <tr class="c-row">
        <th class="c-1">19</th>
        <th style="text-align: center" colspan="8">
          Late fee payable and paid
        </th>
      </tr>
      <tr>
        <td rowspan="2"></td>
        <td colspan="4">Description</td>
        <td colspan="2">Payable</td>
        <td colspan="2">Paid</td>
      </tr>
      <tr>
        <td colspan="4">1</td>
        <td colspan="2">2</td>
        <td colspan="2">3</td>
      </tr>
      <tr>
        <td class="c-1">A</td>
        <td colspan="4">Central Tax</td>
        <td colspan="2"></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td class="c-1">B</td>
        <td colspan="4">State Tax</td>
        <td colspan="2"></td>
        <td colspan="2"></td>
      </tr>
    </tbody>
  </table>
</div>
`,
    {
      tableAutoSize: true,
      defaultStyles: {
        b: { bold: true },
        strong: { bold: true },
        u: { decoration: "underline" },
        s: { decoration: "lineThrough" },
        em: { italics: true },
        i: { italics: true },
        h1: { fontSize: 24, bold: true, marginBottom: 5 },
        h2: { fontSize: 22, bold: true, marginBottom: 5 },
        h3: { fontSize: 20, bold: true, marginBottom: 5 },
        h4: { fontSize: 18, bold: true, marginBottom: 5 },
        h5: { fontSize: 16, bold: true, marginBottom: 5 },
        h6: { fontSize: 14, bold: true, marginBottom: 5 },
        a: { color: "blue", decoration: "underline" },
        strike: { decoration: "lineThrough" },
        p: { margin: [0, 3, 0, 3] },
        ul: { marginBottom: 5 },
        li: { marginLeft: 5 },
        table: { marginBottom: 5 },
        th: { bold: true, fillColor: "#EEEEEE" },
      },
    }
  );

  // https://aymkdn.github.io/html-to-pdfmake/index.html

  let iframeContainer = useRef(null);

  let docDefinition = useRef({
    content: [html],
    styles: {
      "t-d": {
        width: 10,
      },
      "t-v": {
        width: 60,
      },
      "c-1": {
        width: 25,
        alignment: "center",
      },
      "c-2": {
        width: "auto",
      },
      "c-row": {
        fillColor: "#EEEEEE",
      },
      "n-a": {
        fillColor: "#5A5A5A",
      },
    },
  });

  useEffect(() => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition.current);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      setIFrameSrc(dataUrl);
      setPdfMake(pdfDocGenerator);
    });
  }, [setPdfMake, tableData]);
  return (
    <StyledIframe ref={iframeContainer} src={iFrameSrc + "#page=1&view=FitV"} />
  );
});

export default GSTR9;
