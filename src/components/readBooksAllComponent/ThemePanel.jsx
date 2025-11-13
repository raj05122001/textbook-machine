    (u.lessons || []).forEach((l, li) => {
      const lTitle = l.title || `Lesson ${li + 1}`;
      const lPages = l.number_of_pages ?? "—";
      const blocks = blocksFromLesson(l);

      if (blocks.length) {
        blocks.forEach((b, bi) => {
          const titleTop =
            bi === 0
              ? `<h3 style="margin:0 0 8px 0;color:${accent};">${_escapeHtml(uTitle)} • ${ui + 1}.${li + 1} ${_escapeHtml(
                lTitle
              )}</h3>
             <div style="color:#64748b;font-size:12px;margin-bottom:10px">(Estimated pages: ${lPages})</div>`
              : `<h3 style="margin:0 0 8px 0;color:${accent2};">${_escapeHtml(lTitle)} — Page ${bi + 1}</h3>`;

          const safeHtml = stripScripts(b);
          const body = `${titleTop}<div style="line-height:1.6;color:${text}">${safeHtml}</div>`;

          const parts = splitHtmlByParagraphs(body, 1800);
          parts.forEach((part, pi) => {
            const numbered =
              parts.length > 1
                ? part.replace(
                  /(<h3[^>]*>)([\s\S]*?)(<\/h3>)/i,
                  `$1$2 — Part ${pi + 1}/${parts.length}$3`
                )
                : part;
            wrap(numbered, { unit: uTitle, title: lTitle });
          });
        });
      } else {
        const body = `
      <h3 style="margin:0 0 8px 0;color:${accent2};">${_escapeHtml(uTitle)} • ${ui + 1}.${li + 1} ${_escapeHtml(
          lTitle
        )}</h3>
      <div style="color:#64748b;font-size:12px;margin-bottom:10px">(Estimated pages: ${lPages})</div>
      <div style="color:${text}"><em>No content available yet.</em></div>`;
        wrap(body, { unit: uTitle, title: lTitle });
      }
    });