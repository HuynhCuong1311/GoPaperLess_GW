import { ReactComponent as GarbageIcon } from "@/assets/images/svg/garbage_icon.svg";
import { ReactComponent as Save } from "@/assets/images/svg/save1.svg";
import { UseFillForm } from "@/hook/use-fpsService";
import { fpsService } from "@/services/fps_service";
import { getSigner } from "@/utils/commonFunction";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const Size = Quill.import("formats/size");
Size.whitelist = ["13", "14", "18", "20"];
Quill.register(Size, true);

const Font = Quill.import("formats/font");
Font.whitelist = [
  "verdana",
  // "comic-sans",
  // "courier-new",
  // "georgia",
  // "helvetica",
  // "lucida",
];
Quill.register(Font, true);

const CustomToolbar = ({ handleSave, handleRemove, index }) => {
  return (
    <div id={`toolbar-${index}`} className="toolbar">
      <div
        className="canDrag"
        style={{
          position: "absolute",
          top: 0,
          left: "5px",
          content: " ",
          borderLeft: "2px dotted #c1c1c1",
          height: "100%",
          width: "5px",
          cursor: "all-scroll",
        }}
      />
      <select className="ql-font">
        <option value="verdana">Verdana</option>
        {/* <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option> */}
      </select>
      <button className="ql-bold" />
      <button className="ql-italic" />
      {/* <button className="ql-underline" />
      <button className="ql-strike" /> */}
      <select className="ql-size">
        <option value="13">Size 1</option>
        <option value="14">Size 2</option>
        <option value="18">Size 3</option>
        <option value="20">Size 4</option>
      </select>
      <button>
        <SvgIcon
          component={Save}
          inheritViewBox
          sx={{
            width: "23px",
            height: "23px",
            color: "#545454",
            cursor: "pointer",
          }}
          onClick={handleSave}
        />
      </button>
      <button>
        <SvgIcon
          component={GarbageIcon}
          inheritViewBox
          sx={{
            width: "15px",
            height: "15px",
            color: "#545454",
            cursor: "pointer",
          }}
          onClick={handleRemove}
        />
      </button>
    </div>
  );
};

CustomToolbar.propTypes = {
  handleRemove: PropTypes.func,
  handleSave: PropTypes.func,
  index: PropTypes.number,
};

export const AddText = ({
  index,
  pdfPage,
  addTextData,
  workFlow,
  getFields,
}) => {
  // console.log("index: ", index);
  const queryClient = useQueryClient();
  // const putSignature = UseUpdateSig();
  const fillForm = UseFillForm();

  const [isControlled, setIsControlled] = useState(false);
  const [state, setState] = useState({ value: "" });
  // console.log("state: ", state);

  const signer = getSigner(workFlow);
  const signerId = signer?.signerId;

  const [dragPosition, setDragPosition] = useState({
    x: (addTextData.dimension?.x * pdfPage.width) / 100,
    y: (addTextData.dimension?.y * pdfPage.height) / 100,
  });

  useEffect(() => {
    setDragPosition({
      x: (addTextData.dimension?.x * pdfPage.width) / 100,
      y: (addTextData.dimension?.y * pdfPage.height) / 100,
    });
  }, [addTextData]);
  const removeSignature = async () => {
    const res = await fpsService.removeSignature(
      { documentId: workFlow.documentId },
      addTextData.field_name
    );
    if (res.status === 200) {
      await getFields();
    }
  };

  const handleSave = () => {
    console.log("save");
    fillForm.mutate(
      {
        body: [
          {
            field_name: addTextData.field_name,
            value: state.text,
          },
        ],
        type: "text",
        documentId: workFlow.documentId,
      },
      {
        onSuccess: async () => {
          await getFields();
          queryClient.invalidateQueries({ queryKey: ["getWorkFlow"] });
        },
      }
    );
  };

  const handleRemoveSignature = () => {
    console.log("remove");
    // if (isSetPos || signerId !== signatureData.field_name) return;
    removeSignature();
  };

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(`addTextrauria-${index}`);

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  const modules = {
    toolbar: {
      container: `#toolbar-${index}`,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
  ];

  const valueRef = useRef(null);

  const handleChange = (value, delta, source, editor) => {
    const content = editor.getContents();
    console.log("editor: ", editor.getContents());

    setState({
      value,
      text: content.ops[0].insert,
      // fontFamily: content.ops[0].attributes?.font || "Venada",
      // fontSize: content.ops[0].attributes?.size || 13,
      // fontWeight: content.ops[0].attributes?.bold || false,
      // fontStyle: content.ops[0].attributes?.italic || false,
    });

    if (valueRef.current) clearTimeout(valueRef.current);
    valueRef.current = setTimeout(async () => {
      // console.log("content.ops[0].insert: ", content.ops[0].insert);
      const font = content.ops[0].attributes?.font || "vernada";
      // console.log("font: ", font);
      const bold = content.ops[0].attributes?.bold ? "_bold" : "";
      // console.log("bold: ", bold);
      const italic = content.ops[0].attributes?.italic ? "_italic" : "";
      // console.log("italic: ", italic);
      const size = content.ops[0].attributes?.size;
      // console.log("size: ", size);
      const putpos = await fpsService.putSignature(
        {
          field_name: addTextData.field_name,
          page: pdfPage.currentPage,
          dimension: {
            x: -1,
            y: -1,
            width: -1,
            height: -1,
          },
          font: {
            name: font + bold + italic,
            size: size || 13,
          },
          visible_enabled: true,
          value: "",
        },
        "text",
        workFlow.documentId
      );

      if (putpos.status !== 200) return;
      await getFields();
    }, 1000);
  };

  if (
    (addTextData.page !== null && addTextData.page !== pdfPage.currentPage) ||
    addTextData.process_status === "PROCESSED"
  )
    return null;

  return (
    <Draggable
      handle={`.canDrag`}
      // bounds="parent"
      onDrag={() => handleDrag("block")}
      position={dragPosition}
      cancel=".topBar"
      onStart={(e, data) => {
        setDragPosition({ x: data.x, y: data.y });
        setIsControlled(false);
      }}
      onStop={async (e, data) => {
        // console.log("data: ", data);
        // console.log("e: ", e);
        setIsControlled(true);
        handleDrag("none");
        const draggableComponent = document.querySelector(
          `.addTextbox-${index}`
        );
        const targetComponents = document.querySelectorAll(".sig");
        const containerComponent = document.getElementById(
          `pdf-view-${pdfPage.currentPage - 1}`
        );

        const containerRect = containerComponent.getBoundingClientRect();

        const draggableRect = draggableComponent.getBoundingClientRect();

        if (
          draggableRect.right > containerRect.right ||
          draggableRect.left < containerRect.left ||
          draggableRect.bottom > containerRect.bottom ||
          draggableRect.top < containerRect.top
        ) {
          return;
        }
        let isOverTarget = false;

        targetComponents.forEach((targetComponent) => {
          if (isOverTarget) return;

          const targetRect = targetComponent.getBoundingClientRect();

          if (draggableComponent === targetComponent) return;

          if (
            draggableRect.left < targetRect.right &&
            draggableRect.right > targetRect.left &&
            draggableRect.top < targetRect.bottom &&
            draggableRect.bottom > targetRect.top
          ) {
            isOverTarget = true;
            console.log("Draggable component is over the target component");
          }
        });

        if (
          (dragPosition?.x === data.x && dragPosition?.y === data.y) ||
          isOverTarget
        ) {
          return;
        }
        setDragPosition({ x: data.x, y: data.y });
        const rectComp = containerComponent.getBoundingClientRect();

        const rectItem = draggableComponent.getBoundingClientRect();

        const x =
          (Math.abs(rectItem.left - rectComp.left) * 100) / rectComp.width;

        const y =
          (Math.abs(rectItem.top - rectComp.top) * 100) / rectComp.height;
        const putpos = await fpsService.putSignature(
          {
            field_name: addTextData.field_name,
            page: pdfPage.currentPage,
            dimension: {
              x: x,
              y: y,
              width: -1,
              height: -1,
            },
            visible_enabled: true,
          },
          "text",
          workFlow.documentId
        );
        if (putpos.status !== 200) return;
        await getFields();
      }}
      disabled={
        signerId + "_" + addTextData.type + "_" + addTextData.suffix !==
          addTextData.field_name || addTextData.process_status === "PROCESSED"
      }
    >
      <Box
        sx={{
          position: "absolute",
          zIndex: 100,
          transition: isControlled ? `transform 0.3s` : `none`,
        }}
        className={`sig addTextbox-${index}`}
      >
        <Box
          id={`addTextDrag-${index}`}
          sx={{
            height: "100%",
            position: "relative",
          }}
        >
          <span
            className={`addTextrauria-${index} topline`}
            style={{ display: "none" }}
          ></span>
          <span
            className={`addTextrauria-${index} rightline`}
            style={{ display: "none" }}
          ></span>
          <span
            className={`addTextrauria-${index} botline`}
            style={{ display: "none" }}
          ></span>
          <span
            className={`addTextrauria-${index} leftline`}
            style={{ display: "none" }}
          ></span>
          <CustomToolbar
            handleSave={handleSave}
            handleRemove={handleRemoveSignature}
            index={index}
          />
          <ReactQuill
            value={state.value}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            style={{ minWidth: "337px" }} // chỉnh thêm ở file css
          />
        </Box>
      </Box>
    </Draggable>
  );
};

AddText.propTypes = {
  index: PropTypes.number,
  pdfPage: PropTypes.object,
  addTextData: PropTypes.object,
  workFlow: PropTypes.object,
  getFields: PropTypes.func,
};

export default AddText;
