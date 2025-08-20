// books/[id]/page.jsx
"use client";

import React from "react";
import Link from "next/link";

/* ------- Demo data (swap with your API) ------- */
/* ------- Demo data (swap with your API) ------- */
const CATALOG = [
  {
    id: 1,
    title: "Mathematics for Class 10",
    subtitle: "Algebra • Geometry • Trigonometry • Statistics",
    pages: [
      // 1
      "Welcome! This book covers Algebra, Geometry, Trigonometry, and Statistics with solved examples and practice sets.",
      // 2
      <>
        <h3>Algebra – Foundations</h3>
        <p>Variables, constants, expressions, and linear equations. Form of a linear equation: <code>ax + b = 0</code>.</p>
      </>,
      // 3
      <>
        <h3>Linear Equations – Examples</h3>
        <ul>
          <li>3x + 5 = 20 → x = 5</li>
          <li>2(x − 3) = 10 → x = 8</li>
          <li>7 − 2x = −9 → x = 8</li>
        </ul>
      </>,
      // 4
      <>
        <h3>Graphs of Lines</h3>
        <p>Slope-intercept form: <code>y = mx + c</code>. Slope <code>m</code> and intercept <code>c</code> define a unique line.</p>
        <img src="https://picsum.photos/seed/line-graph/700/420" alt="Line Graph" />
      </>,
      // 5
      <>
        <h3>Quadratic Equations</h3>
        <p>Standard form: <code>ax² + bx + c = 0</code>. Discriminant <code>D = b² − 4ac</code>.</p>
        <ul>
          <li>D &gt; 0 → two real distinct roots</li>
          <li>D = 0 → two equal real roots</li>
          <li>D &lt; 0 → complex roots</li>
        </ul>
      </>,
      // 6
      <>
        <h3>Quadratic – Solved Example</h3>
        <p>Equation: <code>x² − 5x + 6 = 0</code> → factors: (x − 2)(x − 3) = 0 → x = 2, 3</p>
      </>,
      // 7
      <>
        <h3>Polynomials</h3>
        <p>Degree, zeros, factor theorem. If <code>p(a)=0</code> then (x − a) is a factor of p(x).</p>
      </>,
      // 8
      <>
        <h3>Algebra – Practice Set A</h3>
        <ol>
          <li>Solve: 4x − 9 = 23</li>
          <li>Find zeros of x² − 7x + 12</li>
          <li>Factorize: 2x² − 5x − 3</li>
        </ol>
      </>,
      // 9
      <>
        <h3>Geometry – Basics</h3>
        <p>Points, lines, angles, triangles, circles. Properties and theorems build reasoning.</p>
      </>,
      // 10
      <>
        <h3>Triangles – Congruence</h3>
        <ul>
          <li>SSS, SAS, ASA, AAS, RHS criteria</li>
          <li>Corresponding parts of congruent triangles are equal (CPCT)</li>
        </ul>
        <img src="https://picsum.photos/seed/tri/700/420" alt="Triangles" />
      </>,
      // 11
      <>
        <h3>Pythagoras Theorem</h3>
        <p>Right triangle with hypotenuse c and legs a,b: <code>a² + b² = c²</code>.</p>
      </>,
      // 12
      <>
        <h3>Circle – Key Terms</h3>
        <p>Chord, diameter, radius, arc, sector, segment; angle subtended by arc at center vs. circumference.</p>
      </>,
      // 13
      <>
        <h3>Coordinate Geometry</h3>
        <p>Distance between (x₁, y₁) and (x₂, y₂): <code>√((x₂ − x₁)² + (y₂ − y₁)²)</code></p>
        <p>Midpoint: <code>((x₁+x₂)/2, (y₁+y₂)/2)</code></p>
      </>,
      // 14
      <>
        <h3>Geometry – Practice Set B</h3>
        <ol>
          <li>Find length of diagonal in a 6–8–? right triangle.</li>
          <li>Midpoint of A(−2, 5) and B(4, −1).</li>
          <li>Arc and central angle relationships.</li>
        </ol>
      </>,
      // 15
      <>
        <h3>Trigonometry – Ratios</h3>
        <p>For right triangle: sin θ, cos θ, tan θ, sec θ, cosec θ, cot θ.</p>
        <img src="https://picsum.photos/seed/trig/700/420" alt="Trigonometry" />
      </>,
      // 16
      <>
        <h3>Trigonometric Identities</h3>
        <ul>
          <li>sin²θ + cos²θ = 1</li>
          <li>1 + tan²θ = sec²θ</li>
          <li>1 + cot²θ = cosec²θ</li>
        </ul>
      </>,
      // 17
      <>
        <h3>Heights & Distances</h3>
        <p>Angle of elevation/depression problems using tan θ. Draw diagram, mark knowns, apply ratio.</p>
      </>,
      // 18
      <>
        <h3>Trigonometry – Practice Set C</h3>
        <ol>
          <li>Compute sin²30° + cos²30°</li>
          <li>Find height of a tower if tan 60° = h/100</li>
          <li>Prove: sec²θ − tan²θ = 1</li>
        </ol>
      </>,
      // 19
      <>
        <h3>Statistics – Basics</h3>
        <p>Mean, median, mode; grouped data, class intervals, frequency distribution, cumulative frequency.</p>
      </>,
      // 20
      <>
        <h3>Mean/Median/Mode</h3>
        <ul>
          <li>Mean (ungrouped): Σx / n</li>
          <li>Median: middle value (or average of two middles)</li>
          <li>Mode: most frequent value</li>
        </ul>
      </>,
      // 21
      <>
        <h3>Histogram & Ogive</h3>
        <p>Graphical representation for grouped frequency; use class boundaries on x-axis, frequencies on y-axis.</p>
        <img src="https://picsum.photos/seed/histo/700/420" alt="Histogram" />
      </>,
      // 22
      <>
        <h3>Statistics – Practice Set D</h3>
        <ol>
          <li>Compute mean of 10 numbers: 4, 7, 2, 9, 5, 3, 8, 6, 1, 10</li>
          <li>Draw histogram for given class intervals</li>
          <li>Find median from cumulative frequency</li>
        </ol>
      </>,
      // 23
      <>
        <h3>Mixed Review – MCQs</h3>
        <ol>
          <li>Roots of x² − 4x + 4?</li>
          <li>Slope of the line 2y − 6x = 1?</li>
          <li>sin²θ + cos²θ equals?</li>
        </ol>
      </>,
      // 24
      <>
        <h3>Revision Notes</h3>
        <ul>
          <li>Memorize identities & common angles</li>
          <li>Practice factoring patterns</li>
          <li>Draw neat diagrams for geometry</li>
        </ul>
      </>,
      // 25
      <>
        <h3>Objective Questions</h3>
        <p>Fill in the blanks & true/false to test quick recall of formulas and properties.</p>
      </>,
      // 26
      <>
        <h3>Formula Sheet (Quick Ref)</h3>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <tbody>
            <tr>
              <td style={{border:"1px solid #ddd", padding:"8px"}}>Distance</td>
              <td style={{border:"1px solid #ddd", padding:"8px"}}>√((x₂ − x₁)² + (y₂ − y₁)²)</td>
            </tr>
            <tr>
              <td style={{border:"1px solid #ddd", padding:"8px"}}>Midpoint</td>
              <td style={{border:"1px solid #ddd", padding:"8px"}}>((x₁+x₂)/2, (y₁+y₂)/2)</td>
            </tr>
            <tr>
              <td style={{border:"1px solid #ddd", padding:"8px"}}>Quadratic Roots</td>
              <td style={{border:"1px solid #ddd", padding:"8px"}}>(−b ± √(b² − 4ac)) / (2a)</td>
            </tr>
          </tbody>
        </table>
      </>,
      // 27
      <>
        <h3>Project Idea</h3>
        <p>Collect real-life data (heights of classmates), make grouped table, plot histogram, find mean/median.</p>
      </>,
      // 28
      <>
        <h3>Challenge Problems</h3>
        <ol>
          <li>Prove: (x − y)³ = x³ − 3x²y + 3xy² − y³</li>
          <li>If A(2,3), B(6,11), find slope of AB and its midpoint</li>
          <li>If sin θ = 3/5, find cos θ and tan θ</li>
        </ol>
      </>,
      // 29
      <>
        <h3>Image Page</h3>
        <img src="https://picsum.photos/seed/mathboard/800/480" alt="Math board" />
      </>,
      // 30
      "The End — Good luck with your exams! Keep practicing daily for best results.",
    ],
  },
];


export default function BookDetailsPage(props) {
  // ✅ Next.js latest: params in client components is a Promise
  const { id } = React.use(props.params);
  const bookId = Number(id);

  const book = React.useMemo(
    () => CATALOG.find((b) => b.id === bookId),
    [bookId]
  );

  if (!book) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0B0D10", color: "#fff" }}>
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Book not found</p>
          <Link href="/books" style={{ color: "#34d399", textDecoration: "underline" }}>Back to all books</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0B0D10", color: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Link href="/books" style={{ opacity: .85 }}>← Back</Link>
          <div style={{ opacity: .6 }}>Textbook Machine</div>
        </div>

        <h1 style={{ fontSize: 34, fontWeight: 800, margin: 0 }}>{book.title}</h1>
        <p style={{ opacity: .8, marginTop: 6 }}>{book.subtitle}</p>

        <FlipBookCSS pages={book.pages} width={520} height={420} />
      </div>
    </div>
  );
}

/* =========================================================
   FlipBookCSS — CSS variables + 3D transforms (no library)
   - Click front/back to flip like a real book
   - Uses CSS custom props: --c (current), --i (index)
   ========================================================= */
function FlipBookCSS({ pages, width = 480, height = 360 }) {
  // group simple pages into sheets (front/back) pairs
  const sheets = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < pages.length; i += 2) {
      arr.push({
        front: pages[i],
        back: pages[i + 1] ?? "",
      });
    }
    return arr;
  }, [pages]);

  const [curr, setCurr] = React.useState(0); // current page index

  const onPageClick = (idx, e) => {
    const isBack = e.target.closest && e.target.closest(".back");
    // click on front -> go to next (idx+1), click on back -> go to current (idx)
    const nextVal = isBack ? idx : idx + 1;
    setCurr(nextVal);
  };

  return (
    <div className="stage " style={{color: "black"}} >
      <div className="book" style={{ width, height, ["--c"]: curr }}>
  {sheets.map((sheet, idx) => {
    const total = pages.length;
    const frontNum = idx * 2 + 1; // right page
    const backNum  = idx * 2 + 2; // left page

    return (
      <div key={idx} className="page" style={{ ["--i"]: idx }}>
        {/* RIGHT PAGE (front) — number bottom-right */}
        <div className="front" onClick={(e) => onPageClick(idx, e)}>
          {typeof sheet.front === "string"
            ? <DemoPage title={`PAGE HEADER - ${frontNum}`} body={sheet.front} />
            : sheet.front}
          {frontNum <= total && (
            <div className="pageNum pageNum-right">{frontNum}</div>
          )}
        </div>

        {/* LEFT PAGE (back) — number bottom-left */}
        <div className="back" onClick={(e) => onPageClick(idx, e)}>
          {typeof sheet.back === "string"
            ? <DemoPage title={`PAGE HEADER - ${backNum}`} body={sheet.back} />
            : sheet.back}
          {backNum <= total && (
            <div className="pageNum pageNum-left">{backNum}</div>
          )}
        </div>
      </div>
    );
  })}
</div>


      {/* --- styles (scoped) --- */}
      <style jsx>{`
  /* ---------- layout stays same ---------- */
  .stage{
    margin-top:18px; display:flex; justify-content:center; perspective:1000px;
  }
  .book{
    --paper-top:#efe2cf;        /* top tint */
    --paper-bottom:#e6d3b5;     /* bottom tint */
    --paper-back-top:#e7d5bb;   /* back page tint */
    --paper-back-bottom:#f0e4cd;
    --paper-edge:#d7c2a2;

    display:flex; margin:24px auto 0;
    pointer-events:none; transform-style:preserve-3d;
    transition:translate 1s;
    translate:calc(min(var(--c),1)*50%) 0%;
    rotate:1 0 0 30deg;
  }
  .page{
    --thickness:5;
    flex:none; display:flex; width:100%;
    pointer-events:all; user-select:none;
    transform-style:preserve-3d; transform-origin:left center;
    border:1px solid rgba(80,60,30,.25);
    transition:
      transform 1s,
      rotate 1s ease-in calc((min(var(--i),var(--c)) - max(var(--i),var(--c))) * 50ms);
    translate:calc(var(--i) * -100%) 0 0;
    transform:translateZ(calc((var(--c) - var(--i) - .5) * calc(var(--thickness) * 1px)));
    rotate:0 1 0 calc(clamp(0, var(--c) - var(--i), 1) * -180deg);
    box-shadow:0 16px 40px rgba(0,0,0,.28);
    background:transparent; /* page faces handle color */
    border-radius:8px;
  }

  .front, .back{
    position:relative;
    flex:none; width:100%; padding:18px;
    backface-visibility:hidden; translate:0; border-radius:8px;
    /* paper gradient */
    background:linear-gradient(180deg,var(--paper-top) 0%, var(--paper-bottom) 100%);
    /* subtle inner shadows like real paper */
    box-shadow:
      inset 0 0 0 1px rgba(115,84,40,.10),
      inset 0 -8px 28px rgba(115,84,40,.10),
      inset 8px 0 22px rgba(0,0,0,.05);
  }

  /* paper grain / noise + corner vignette */
  .front::before, .back::before{
    content:""; position:absolute; inset:0; pointer-events:none; border-radius:8px;
    background:
      radial-gradient( at 10% 8%, rgba(0,0,0,.06), transparent 55% ),
      radial-gradient( at 90% 92%, rgba(0,0,0,.05), transparent 55% ),
      repeating-linear-gradient(0deg, rgba(0,0,0,.03) 0 1px, transparent 1px 2px);
    mix-blend-mode:multiply; opacity:.35;
  }

  /* outer edge slight darker like the screenshot */
  .front::after{
    content:""; position:absolute; inset:0; border-radius:8px; pointer-events:none;
    background:linear-gradient(to right, rgba(0,0,0,.08), transparent 35%);
    opacity:.35;
  }

  .back{
    /* back page a touch lighter */
    background:linear-gradient(180deg,var(--paper-back-top) 0%, var(--paper-back-bottom) 100%);
    translate:-100% 0; rotate:0 1 0 180deg;
  }
  .back::after{
    content:""; position:absolute; inset:0; border-radius:8px; pointer-events:none;
    background:linear-gradient(to left, rgba(0,0,0,.10), transparent 40%);
    opacity:.35;
  }

  .page :global(img){
    width:100%; height:220px; object-fit:cover; border-radius:6px;
    box-shadow:0 8px 22px rgba(0,0,0,.15);
  }

  .pageNum{
  position: absolute;
  bottom: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #5a4934;            /* warm paper ink */
  opacity: .9;
  pointer-events: none;      /* clicks still flip */
  letter-spacing: .02em;
    }
    .pageNum-left{  left: 14px;  text-align: left;  }
    .pageNum-right{ right: 14px; text-align: right; }

`}</style>

    </div>
  );
}

/* -------- demo page content (replace with your own JSX) -------- */
function DemoPage({ title, body }) {
  return (
    <div>
      <h3 style={{ margin: 0, fontWeight: 800 }}>{title}</h3>
      <p style={{ marginTop: 8, lineHeight: 1.7, color: "#374151" }}>{body}</p>
    </div>
  );
}
