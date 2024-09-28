import { UseUpdateSig } from "@/hook/use-fpsService";
import { useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import {
  forwardRef,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import Box from "@mui/material/Box";

const SignatureItem = lazy(() =>
  import("@/components/configuration/components/SignatureItem")
);

export const DocumentPreview = forwardRef(({ pdfProps, state }, ref) => {
  const queryClient = useQueryClient();
  const putSignature = UseUpdateSig();
  const pdfPage = useMemo(
    () => ({
      currentPage: pdfProps.pageIndex + 1,
      height: pdfProps.height,
      width: pdfProps.width,
      zoom: pdfProps.scale,
      actualHeight: pdfProps.height / pdfProps.scale,
      actualWidth: pdfProps.width / pdfProps.scale,
      rotate: pdfProps.rotation,
    }),
    [
      pdfProps.pageIndex,
      pdfProps.height,
      pdfProps.width,
      pdfProps.scale,
      pdfProps.rotation,
    ]
  );
  const [dragPosition, setDragPosition] = useState({
    x: (state.data.signatureData.dimension?.x * pdfPage.width) / 100,
    y: (state.data.signatureData.dimension?.y * pdfPage.height) / 100,
  });

  const [isControlled, setIsControlled] = useState(true);
  // const dragRef = useRef(null);

  const currentPos = useRef({
    x: (state.data.signatureData.dimension?.x * pdfPage.width) / 100,
    y: (state.data.signatureData.dimension?.y * pdfPage.height) / 100,
  });

  useEffect(() => {
    setDragPosition({
      x: (state.data.signatureData.dimension?.x * pdfPage.width) / 100,
      y: (state.data.signatureData.dimension?.y * pdfPage.height) / 100,
    });
  }, [state.data.signatureData, pdfPage.width, pdfPage.height]);

  const handleDrag = (type) => {
    const elements = document.getElementsByClassName(
      `rauria-${state.data.index}`
    );

    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = type;
    }
  };

  if (
    state.data.signatureData.page !== null &&
    state.data.signatureData.page !== pdfPage.currentPage
  )
    return null;

  return (
    <Draggable
      // nodeRef={dragRef}
      handle={`#sigDrag1-${state.data.index}`}
      // bounds="parent"
      onDrag={() => handleDrag("block")}
      position={dragPosition}
      cancel=".topBar"
      onStart={(e, data) => {
        setDragPosition({ x: data.x, y: data.y });
        currentPos.current.x = data.x;
        currentPos.current.y = data.y;
        setIsControlled(false);
      }}
      onStop={(e, data) => {
        // console.log("state.data.signatureData: ", state.data.signatureData);
        // console.log("e: ", e);
        if (state.data.signatureData.process_status === "PROCESSED") return;

        setIsControlled(true);
        handleDrag("none");
        const draggableComponent = document.querySelector(
          `.signature1-${state.data.index}`
        );
        const containerComponent = document.getElementById(
          `pdf-view1-${pdfPage.currentPage - 1}`
        );

        if (dragPosition?.x === data.x && dragPosition?.y === data.y) {
          return;
        }
        setDragPosition({ x: data.x, y: data.y });
        const rectComp = containerComponent.getBoundingClientRect();

        const rectItem = draggableComponent.getBoundingClientRect();

        const x =
          (Math.abs(rectItem.left - rectComp.left) * 100) / rectComp.width;

        const y =
          (Math.abs(rectItem.top - rectComp.top) * 100) / rectComp.height;

        putSignature.mutate(
          {
            body: {
              field_name: state.data.signatureData.field_name,
              page: pdfPage.currentPage,
              dimension: {
                x: x,
                y: y,
                width: -1,
                height: -1,
              },
              visible_enabled: true,
            },
            field: state.data.signatureData.type.toLowerCase(),
            documentId: state.data.documentId,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["getField"] });
            },
          }
        );
      }}
    >
      <ResizableBox
        width={
          state.data.signatureData.dimension?.width
            ? state.data.signatureData.dimension?.width * (pdfPage.width / 100)
            : Infinity
        }
        height={
          state.data.signatureData.dimension?.height
            ? state.data.signatureData.dimension?.height *
              (pdfPage.height / 100)
            : 150
        }
        style={{
          position: "absolute",
          zIndex: 100,
          opacity:
            state.data.signatureData.process_status === "PROCESSED" ? 0 : 1,
          transition: isControlled ? `transform 0.3s` : `none`,
        }}
        minConstraints={[200, 50]}
        maxConstraints={[Infinity, Infinity]}
        //   onResize={(e, { size }) => {}}
        onResizeStop={(e, { size }) => {
          // console.log("e: ", e);
          putSignature.mutate(
            {
              body: {
                field_name: state.data.signatureData.field_name,
                page: pdfPage.currentPage,
                dimension: {
                  x: -1,
                  y: -1,
                  width: (size.width / pdfPage.width) * 100,
                  height: (size.height / pdfPage.height) * 100,
                },
                visible_enabled: true,
              },
              field: state.data.signatureData.type.toLowerCase(),
              documentId: state.data.documentId,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["getField"] });
              },
            }
          );
        }}
        className={`sig signature1-${state.data.index}`}
      >
        <Box
          id={`sigDrag1-${state.data.index}`}
          sx={{
            height: "100%",
            position: "relative",

            // zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3px",
            border: "2px dashed",
            borderColor: "#EAB308",
            fontSize: "66%", // test
            overflow: "hidden",
          }}
        >
          <div ref={ref}>
            <span
              className={`rauria-${state.data.index} topline`}
              style={{ display: "none" }}
            ></span>
            <span
              className={`rauria-${state.data.index} rightline`}
              style={{ display: "none" }}
            ></span>
            <span
              className={`rauria-${state.data.index} botline`}
              style={{ display: "none" }}
            ></span>
            <span
              className={`rauria-${state.data.index} leftline`}
              style={{ display: "none" }}
            ></span>
            <Suspense fallback={<div>Loading...</div>}>
              <SignatureItem data={state.data} />
            </Suspense>
          </div>
        </Box>
      </ResizableBox>
    </Draggable>
  );
});

DocumentPreview.propTypes = {
  pdfProps: PropTypes.object,
  state: PropTypes.object,
};
DocumentPreview.displayName = "DocumentPreview";
export default DocumentPreview;
