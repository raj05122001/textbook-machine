"use client";

import React from "react";

export default function EditorPanel({ onClose }) {
  const fonts = ["Arial", "Inter", "Times New Roman", "Georgia", "Roboto"];
  const sizes = [10, 11, 12, 14, 16, 18, 20, 24];

  const fileRef = React.useRef(null);
  const [objectUrls, setObjectUrls] = React.useState([]);

  const lastRangeRef = React.useRef(null);
  const lastEditableElRef = React.useRef(null);

  const [selectedImg, setSelectedImg] = React.useState(null);
  const [imgWidth, setImgWidth] = React.useState(400);

  const [overlayRect, setOverlayRect] = React.useState(null);
  const resizingRef = React.useRef(null);
  const draggingRef = React.useRef(null);

  // NEW: panel animation
  const [panelReady, setPanelReady] = React.useState(false);
  React.useEffect(() => {
    setPanelReady(true);
  }, []);

  React.useEffect(() => {
    return () => {
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [objectUrls]);

  function saveCurrentRangeIfEditable() {
    const sel = window.getSelection && window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const root = range.startContainer
      ? (range.startContainer.nodeType === 1
          ? range.startContainer
          : range.startContainer.parentElement
        )?.closest('[data-editable="true"]')
      : null;
    if (root) {
      lastRangeRef.current = range.cloneRange();
      lastEditableElRef.current = root;
    }
  }

  function placeCaretAtEnd(el) {
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      lastRangeRef.current = range.cloneRange();
      lastEditableElRef.current = el;
    } catch {}
  }

  React.useEffect(() => {
    function onDocClick(e) {
      const t = e.target;
      if (!t) return;
      const editableRoot = t.closest?.('[data-editable="true"]');
      if (editableRoot) {
        setTimeout(() => {
          saveCurrentRangeIfEditable();
          if (t.tagName === "IMG") {
            const img = t;
            setSelectedImg(img);
            const w =
              (img.style.width && parseInt(img.style.width, 10)) ||
              Math.min(
                img.naturalWidth || 400,
                editableRoot.clientWidth || 720
              );
            setImgWidth(w);
            updateOverlayRect(img);
          } else {
            setSelectedImg(null);
            setOverlayRect(null);
          }
        }, 0);
      } else {
        setSelectedImg(null);
        setOverlayRect(null);
      }
    }
    function onSelectionChange() {
      saveCurrentRangeIfEditable();
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  React.useEffect(() => {
    function onWin() {
      if (selectedImg) updateOverlayRect(selectedImg);
    }
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    return () => {
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [selectedImg]);

  function updateOverlayRect(img) {
    if (!img) {
      setOverlayRect(null);
      return;
    }
    const r = img.getBoundingClientRect();
    setOverlayRect({
      left: r.left + window.scrollX,
      top: r.top + window.scrollY,
      width: r.width,
      height: r.height,
    });
  }

  function cmd(command, value = null) {
    try {
      const sel = window.getSelection && window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        if (lastRangeRef.current) {
          try {
            sel.addRange(lastRangeRef.current);
          } catch {}
        }
      }

      const prevY =
        window.scrollY || document.documentElement.scrollTop || 0;
      document.execCommand(command, false, value);

      const target =
        lastEditableElRef.current ||
        document.activeElement?.closest?.('[data-editable="true"]') ||
        document.querySelector('[data-editable="true"]');

      if (target && target.focus) {
        try {
          target.focus({ preventScroll: true });
        } catch {
          target.focus();
        }
      }

      if (
        (window.scrollY || document.documentElement.scrollTop || 0) !==
        prevY
      ) {
        window.scrollTo({
          top: prevY,
          left: 0,
          behavior: "instant" in window ? "instant" : "auto",
        });
      }

      saveCurrentRangeIfEditable();
    } catch {}
  }

  function makeLink() {
    const url = prompt("Enter URL:");
    if (!url) return;
    cmd("createLink", url);
  }
  function setFont(e) {
    cmd("fontName", e.target.value);
  }
  function setSize(e) {
    const px = Number(e.target.value);
    const map = { 10: 1, 11: 1, 12: 2, 14: 3, 16: 4, 18: 5, 20: 6, 24: 7 };
    cmd("fontSize", map[px] || 3);
  }
  function setColor(e) {
    cmd("foreColor", e.target.value);
  }
  function setHilite(e) {
    cmd("hiliteColor", e.target.value);
  }

  // Image insert (local)
  async function insertImageFromFile(f) {
    const editable =
      lastEditableElRef.current ||
      document.activeElement?.closest?.('[data-editable="true"]');
    if (!editable || !f) return;

    const blobUrl = URL.createObjectURL(f);
    setObjectUrls((arr) => [...arr, blobUrl]);

    const tempId = `tbm-up-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const html =
      `<img id="${tempId}" src="${blobUrl}" class="tbm-img" ` +
      `style="max-width:100%;height:auto;width:400px;display:block;margin:8px auto;cursor:pointer;" />`;

    editable.focus();
    const sel = window.getSelection();
    sel?.removeAllRanges();

    if (lastRangeRef.current) {
      try {
        sel?.addRange(lastRangeRef.current);
      } catch {
        placeCaretAtEnd(editable);
      }
    } else {
      placeCaretAtEnd(editable);
    }

    try {
      document.execCommand("insertHTML", false, html);
    } catch {
      editable.insertAdjacentHTML("beforeend", html);
    }

    editable.focus();
    saveCurrentRangeIfEditable();
  }

  async function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (f) {
      try {
        await insertImageFromFile(f);
      } finally {
        e.target.value = "";
      }
    }
  }

  function onPickImageClick() {
    if (fileRef.current) fileRef.current.click();
  }

  function beginResize(dir, e) {
    if (!selectedImg) return;
    e.preventDefault();
    const r = selectedImg.getBoundingClientRect();
    resizingRef.current = {
      dir,
      startX: e.pageX,
      startY: e.pageY,
      startW: r.width,
      startH: r.height,
      naturalRatio:
        (selectedImg.naturalWidth || r.width) /
        (selectedImg.naturalHeight || r.height),
    };
    document.addEventListener("mousemove", onResizing);
    document.addEventListener("mouseup", endResize, { once: true });
  }
  function onResizing(e) {
    const s = resizingRef.current;
    if (!s || !selectedImg) return;
    const dx = e.pageX - s.startX;
    const dy = e.pageY - s.startY;
    let w = s.startW,
      h = s.startH;

    if (s.dir.includes("e")) w = s.startW + dx;
    if (s.dir.includes("w")) w = s.startW - dx;
    if (s.dir.includes("s")) h = s.startH + dy;
    if (s.dir.includes("n")) h = s.startH - dy;

    if (e.shiftKey) {
      const ratio = s.naturalRatio || s.startW / s.startH;
      if (Math.abs(dx) > Math.abs(dy)) {
        h = w / ratio;
      } else {
        w = h * ratio;
      }
    }

    w = Math.max(80, w);
    h = Math.max(80, h);

    selectedImg.style.width = `${w}px`;
    selectedImg.style.height = `${h}px`;
    selectedImg.style.maxWidth = "none";

    setImgWidth(w);
    updateOverlayRect(selectedImg);
  }
  function endResize() {
    document.removeEventListener("mousemove", onResizing);
    resizingRef.current = null;
    saveCurrentRangeIfEditable();
  }

  function beginDrag(e) {
    if (!selectedImg || !overlayRect) return;
    e.preventDefault();
    const r = selectedImg.getBoundingClientRect();
    draggingRef.current = {
      startX: e.pageX,
      startY: e.pageY,
      startLeft: r.left + window.scrollX,
      startTop: r.top + window.scrollY,
    };
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", endDrag, { once: true });
  }
  function onDragging(e) {
    const s = draggingRef.current;
    if (!s) return;
    const dx = e.pageX - s.startX;
    const dy = e.pageY - s.startY;
    setOverlayRect((rect) =>
      rect
        ? {
            ...rect,
            left: s.startLeft + dx,
            top: s.startTop + dy,
          }
        : rect
    );
  }
  function endDrag() {
    document.removeEventListener("mousemove", onDragging);
    draggingRef.current = null;
    updateOverlayRect(selectedImg);
  }

  React.useEffect(() => {
    if (!selectedImg) return;
    function onWheel(e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1 / 1.1 : 1.1;
      const currentW =
        selectedImg.getBoundingClientRect().width || imgWidth || 400;
      const w = Math.max(80, currentW * factor);
      selectedImg.style.width = `${w}px`;
      selectedImg.style.height = "auto";
      selectedImg.style.maxWidth = "none";
      setImgWidth(w);
      updateOverlayRect(selectedImg);
    }
    function onKey(e) {
      if (!selectedImg) return;
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        const currentW =
          selectedImg.getBoundingClientRect().width || imgWidth || 400;
        const w = Math.max(80, currentW * 1.1);
        selectedImg.style.width = `${w}px`;
        selectedImg.style.height = "auto";
        setImgWidth(w);
        updateOverlayRect(selectedImg);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        const currentW =
          selectedImg.getBoundingClientRect().width || imgWidth || 400;
        const w = Math.max(80, currentW / 1.1);
        selectedImg.style.width = `${w}px`;
        selectedImg.style.height = "auto";
        setImgWidth(w);
        updateOverlayRect(selectedImg);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "0") {
        e.preventDefault();
        const w = selectedImg.naturalWidth || 400;
        selectedImg.style.width = `${w}px`;
        selectedImg.style.height = "auto";
        setImgWidth(w);
        updateOverlayRect(selectedImg);
      }
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedImg, imgWidth]);

  // NEW: fancy button (same feel as theme panel)
  const btn = (label, onClick, title) => (
    <button
      onClick={onClick}
      title={title || label}
      style={{
        height: 32,
        padding: "0 10px",
        borderRadius: 999,
        border: "1px solid rgba(148,163,184,0.7)",
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.95))",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 12,
        color: "#e5e7eb",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        boxShadow: "0 6px 18px rgba(15,23,42,0.7)",
        transition:
          "transform 120ms ease-out, box-shadow 120ms ease-out, background 120ms ease-out",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {label}
    </button>
  );

  function Overlay() {
    if (!selectedImg || !overlayRect) return null;
    const { left, top, width, height } = overlayRect;
    const boxStyle = {
      position: "absolute",
      left,
      top,
      width,
      height,
      border: "2px solid #2563eb",
      borderRadius: 6,
      boxSizing: "border-box",
      pointerEvents: "none",
      zIndex: 9998,
    };
    const handleBase = {
      position: "absolute",
      width: 12,
      height: 12,
      borderRadius: 6,
      border: "2px solid #fff",
      background: "#2563eb",
      boxShadow: "0 0 0 1px #2563eb",
      pointerEvents: "auto",
    };
    const mkHandle = (dir, style, cursor) => (
      <div
        key={dir}
        onMouseDown={(e) => beginResize(dir, e)}
        style={{ ...handleBase, ...style, cursor }}
        title={`Resize ${dir.toUpperCase()} (Shift = lock ratio)`}
      />
    );

    const handles = [
      mkHandle("nw", { left: -6, top: -6 }, "nwse-resize"),
      mkHandle("n", { left: width / 2 - 6, top: -6 }, "ns-resize"),
      mkHandle("ne", { left: width - 6, top: -6 }, "nesw-resize"),
      mkHandle("e", { left: width - 6, top: height / 2 - 6 }, "ew-resize"),
      mkHandle("se", { left: width - 6, top: height - 6 }, "nwse-resize"),
      mkHandle("s", { left: width / 2 - 6, top: height - 6 }, "ns-resize"),
      mkHandle("sw", { left: -6, top: height - 6 }, "nesw-resize"),
      mkHandle("w", { left: -6, top: height / 2 - 6 }, "ew-resize"),
    ];

    const dragBarStyle = {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: 24,
      background: "rgba(37,99,235,.15)",
      cursor: "move",
      pointerEvents: "auto",
      borderBottom: "1px solid rgba(37,99,235,.4)",
    };

    return React.createElement(
      React.Fragment,
      null,
      <div style={boxStyle} />,
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        <div style={dragBarStyle} onMouseDown={beginDrag} />
        {handles}
      </div>
    );
  }

  return (
    <aside
      style={{
        position: "sticky",
        top: 16,
        alignSelf: "start",
        height: "calc(90vh - 32px)",
        padding: 1,
        borderRadius: 18,
        background:
          "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.22))",
 
        opacity: panelReady ? 1 : 0,
        transform: panelReady ? "translateX(0)" : "translateX(28px)",
        transition: "opacity 220ms ease-out, transform 220ms ease-out",
        zIndex: 50,
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 16,
         
          border: "1px solid rgba(148,163,184,0.2)",
          padding: 14,
          overflow: "auto",
          color: "#e5e7eb",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            gap: 8,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                color: "#000000ff",
              }}
            >
              Editor
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#000000ff",
                marginTop: 2,
              }}
            >
              Format text, insert images and tweak content visually.
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close editor panel"
            style={{
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.6)",
              background:
                "#FFF",
              color: "#000000ff",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: 600,
              transition:
                "transform 120ms ease-out, box-shadow 120ms ease-out, background 120ms ease-out",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            ✕ <span>Close</span>
          </button>
        </div>

        {/* IMAGE INSERT SECTION */}
        <div
          style={{
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: 14,
            padding: 10,
            marginBottom: 12,
            background:
              "radial-gradient(circle at top right, rgba(96,165,250,0.18), rgba(15,23,42,0.9))",
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.18,
              color: "#ffffffff",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Media
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {btn("🖼 Insert image", onPickImageClick, "Insert an image")}
          </div>
        </div>

        {/* FONT + STYLE SECTION */}
        <div
          style={{
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: 14,
            padding: 10,
            marginBottom: 12,
            background:
              "radial-gradient(circle at top, rgba(37,99,235,0.16), rgba(15,23,42,0.96))",
            display: "grid",
            gap: 10,
            fontSize: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.18,
              color: "#fafafaff",
              fontWeight: 700,
              marginBottom: 2,
            }}
          >
            Typography
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <select
              onChange={setFont}
              style={{
                height: 32,
                border: "1px solid rgba(148,163,184,0.7)",
                borderRadius: 999,
                padding: "0 10px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,1), rgba(30,64,175,0.9))",
                color: "#f9fafb",
                fontSize: 12,
              }}
            >
              {fonts.map((f) => (
                <option
                  key={f}
                  value={f}
                  style={{ backgroundColor: "#020617", color: "#e5e7eb" }}
                >
                  {f}
                </option>
              ))}
            </select>
            <select
              onChange={setSize}
              defaultValue={16}
              style={{
                height: 32,
                border: "1px solid rgba(148,163,184,0.7)",
                borderRadius: 999,
                padding: "0 10px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,1), rgba(30,64,175,0.9))",
                color: "#f9fafb",
                fontSize: 12,
              }}
            >
              {sizes.map((s) => (
                <option
                  key={s}
                  value={s}
                  style={{ backgroundColor: "#020617", color: "#e5e7eb" }}
                >
                  {s}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {btn("B", () => cmd("bold"), "Bold")}
              {btn("I", () => cmd("italic"), "Italic")}
              {btn("U", () => cmd("underline"), "Underline")}
              {btn("S", () => cmd("strikeThrough"), "Strikethrough")}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#cbd5f5",
                  width: 72,
                }}
              >
                Text
              </span>
              <input
                type="color"
                defaultValue="#111827"
                onChange={setColor}
                style={{ cursor: "pointer" }}
              />
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#cbd5f5",
                  width: 72,
                }}
              >
                Highlight
              </span>
              <input
                type="color"
                defaultValue="#ffff00"
                onChange={setHilite}
                style={{ cursor: "pointer" }}
              />
            </label>

            {btn("Clear", () => cmd("removeFormat"), "Clear direct formatting")}
          </div>
        </div>

        {/* ALIGN / LIST / LINK SECTION */}
        <div
          style={{
            border: "1px solid rgba(148,163,184,0.45)",
            borderRadius: 14,
            padding: 10,
            marginBottom: 12,
            background:
              "radial-gradient(circle at bottom left, rgba(59,130,246,0.18), rgba(15,23,42,0.9))",
            display: "grid",
            gap: 8,
            fontSize: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.18,
              color: "#ffffffff",
              fontWeight: 700,
            }}
          >
            Layout & lists
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {btn("Left", () => cmd("justifyLeft"), "Align left")}
            {btn("Center", () => cmd("justifyCenter"), "Align center")}
            {btn("Right", () => cmd("justifyRight"), "Align right")}
            {btn("Justify", () => cmd("justifyFull"), "Justify")}
            {btn("• List", () => cmd("insertUnorderedList"), "Bullet list")}
            {btn("1. List", () => cmd("insertOrderedList"), "Numbered list")}
            {btn("Link", makeLink, "Create link")}
            {btn("— Indent", () => cmd("outdent"), "Outdent")}
            {btn("+ Indent", () => cmd("indent"), "Indent")}
          </div>
        </div>

        <Overlay />
      </div>
    </aside>
  );
}
