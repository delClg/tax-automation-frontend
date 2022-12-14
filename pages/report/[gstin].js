import Head from "next/head";
import Image, { Icon } from "semantic-ui-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import styles from "../styles/Home.module.css";
import config from "../../config";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  Button,
  Card,
  Dimmer,
  Header,
  Loader,
  Modal,
  Segment,
} from "semantic-ui-react";
import { styled } from "@stitches/react";
import { useDropzone } from "react-dropzone";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { backendURL } = config;

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const StyledSection = styled("section", {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  alignContent: "center",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "10px",
  marginTop: "20px",
});

const PDFSegment = styled(Segment, {
  margin: "auto",
  width: "600px",
  aspectRatio: "1 / 1.414",
  // aspectRatio: "1",
});

const DynamicGSTR9 = dynamic(() => import("../../components/gstr9"), {
  ssr: false,
});
const DynamicGSTR3B = dynamic(() => import("../../components/gstr3b"), {
  ssr: false,
});
const DynamicGSTR1 = dynamic(() => import("../../components/gstr1"), {
  ssr: false,
});
const DynamicReport = dynamic(() => import("../../components/report"), {
  ssr: false,
});

// async function getGSTR9Data(gstin, callback) {
//   let res = await fetch(`${backendURL}/api/v1/r9?GSTIN=${gstin}`);
//   let data = await res.json();
//   callback(data.data);
// }

// async function getGSTR3BData(gstin, callback) {
//   let res = await fetch(`${backendURL}/api/v1/r3b?GSTIN=${gstin}`);
//   let data = await res.json();
//   callback(data.data);
// }

async function getReportData(gstin, postData, callback) {
  let res = await fetch(`/api/report?gstin=${gstin}`, {
    method: "POST",
    body: JSON.stringify(postData),
  });
  let data = await res.json();
  callback(data.data);
}

// async function getGSTR1Data(gstin, callback) {
//   let res1 = await fetch(`${backendURL}/api/v1/r1?GSTIN=${gstin}`);
//   let res2 = await fetch(`${backendURL}/api/v1/r12?GSTIN=${gstin}`);
//   let data1 = await res1.json();
//   let data2 = await res2.json();
//   let data = { ...data1.data, ...data2.data };
//   callback(data);
// }

export default function GSTSummary() {
  let [pdfMakeGSTR1, setPdfMakeGSTR1] = useState(null);
  let [pdfMakeGSTR3b, setPdfMakeGSTR3b] = useState(null);
  let [pdfMakeGSTR9, setPdfMakeGSTR9] = useState(null);
  let [pdfUrl, setPdfUrl] = useState(null);
  let [open, setOpen] = React.useState(false);
  let [files, setFiles] = useState([]);
  let [fileReading, setFileReading] = useState(false);
  let [bufferData, setBuffferData] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setFiles(acceptedFiles);
    console.log({ acceptedFiles });
  }, []);
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open: selectFiles,
  } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    accept: {
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
  });

  const dropboxStyles = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  async function handleFiles() {
    let remarksData = [];
    files.forEach((file, ind) => {
      if (file.name == remarksData[ind]?.file?.name) return;
      const reader = new FileReader();

      reader.onabort = () =>
        console.log(`${file.name} file reading was aborted`);
      reader.onerror = () =>
        console.log(`${file.name} file reading has failed`);
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
        // file.bufferData = binaryStr;
        remarksData.push({ file, arrayBuffer: binaryStr });
        if (remarksData.length == files.length) {
          console.log({ files, remarksData });
          setBuffferData(remarksData);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  let router = useRouter();

  const { gstin } = router.query;

  let [GSTR1Data, setGSTR1Data] = useState(null);
  let [GSTR9Data, setGSTR9Data] = useState(null);
  let [GSTR3BData, setGSTR3BData] = useState(null);
  let [reportData, setReportData] = useState(null);
  // let [reportData, setReportData] = useState({});

  useEffect(() => {
    if (gstin) {
      // getGSTR1Data(gstin, setGSTR1Data);
      // getGSTR9Data(gstin, setGSTR9Data);
      // getGSTR3BData(gstin, setGSTR3BData);
      getReportData(gstin, router.query, (data) => {
        setReportData(data.Report);
        setGSTR1Data(data.R1Data);
        setGSTR3BData(data.R3Data);
        setGSTR9Data(data.R9Data);
      });
    }
  }, [gstin]);
  return (
    <StyledSection>
      <PDFSegment raised>
        {reportData != null && fileReading != true ? (
          <>
            <Header as="h3" color="teal" textAlign="center">
              Generated Report
            </Header>
            <Button
              fluid
              disabled={pdfUrl == null}
              onClick={() => window.open(pdfUrl)}
            >
              Open In New Tab
            </Button>
            <Modal
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              open={open}
              trigger={
                <Button
                  style={{ margin: "3px 0px" }}
                  fluid
                  disabled={pdfUrl == null}
                >
                  Add Remarks
                </Button>
              }
            >
              <Modal.Header>Select a pdf/word document</Modal.Header>
              <Modal.Content>
                <Segment
                  placeholder
                  style={{
                    width: "100%",
                  }}
                  {...getRootProps({ style: dropboxStyles })}
                >
                  <Header icon>
                    <Icon name="file word outline" />
                    {files.length > 0
                      ? ""
                      : "No docx documents are listed for this customer."}
                  </Header>
                  <Button
                    primary
                    content={
                      files.length > 0 ? "Add document" : "Choose Document"
                    }
                    labelPosition="left"
                    icon="file word outline"
                    onClick={selectFiles}
                  />
                  <input {...getInputProps()} />
                  {files.length > 0 ? (
                    <p style={{ marginTop: "1.5rem" }}>
                      Files Selected:{" "}
                      <em>{files.map((file) => file.name).join(", ")}</em>
                    </p>
                  ) : (
                    ""
                  )}
                </Segment>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  color="black"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  content="Clear Files"
                  labelPosition="right"
                  icon="delete"
                  onClick={() => {
                    setFiles([]);
                    setBuffferData([]);
                  }}
                  negative
                />
                <Button
                  content="Done"
                  labelPosition="right"
                  icon="checkmark"
                  onClick={async () => {
                    setFileReading(true);
                    await handleFiles();
                    setFileReading(false);
                    setOpen(false);
                  }}
                  positive
                />
              </Modal.Actions>
            </Modal>
            <DynamicReport
              tableData={reportData}
              gstin={gstin}
              setPdfUrl={setPdfUrl}
              remarkFiles={bufferData}
            />
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment>
      {/* <PDFSegment raised>
        {GSTR1Data != null ? (
          <>
            <Header as="h3" color="teal" textAlign="center">
              GSTR-1
            </Header>
            <Button
              fluid
              disabled={pdfMakeGSTR1 == null}
              onClick={() => pdfMakeGSTR1.open()}
            >
              Open In New Tab
            </Button>
            <DynamicGSTR1
              tableData={GSTR1Data}
              gstin={gstin}
              setPdfMake={setPdfMakeGSTR1}
            />
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment>
      <PDFSegment raised>
        {GSTR3BData != null ? (
          <>
            <Header as="h3" color="teal" textAlign="center">
              GSTR-3B
            </Header>
            <Button
              fluid
              disabled={pdfMakeGSTR3b == null}
              onClick={() => pdfMakeGSTR3b.open()}
            >
              Open In New Tab
            </Button>
            <DynamicGSTR3B
              tableData={GSTR3BData}
              setPdfMake={setPdfMakeGSTR3b}
            />
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment>
      <PDFSegment raised>
        {GSTR9Data != null ? (
          <>
            <Header as="h3" color="teal" textAlign="center">
              GSTR-9
            </Header>
            <Button
              fluid
              disabled={pdfMakeGSTR9 == null}
              onClick={() => pdfMakeGSTR9.open()}
            >
              Open In New Tab
            </Button>
            <DynamicGSTR9 tableData={GSTR9Data} setPdfMake={setPdfMakeGSTR9} />
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment> */}
    </StyledSection>
  );
}
