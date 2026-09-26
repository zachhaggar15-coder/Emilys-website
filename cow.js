// Draws the pet highland cow as a cute cartoon SVG string.
// window.CowArt.render({ stage, mood, hat, face, neck }) returns SVG markup.
// The little animations (blinking, ear wiggles, tail swish) live in styles.css.
(function () {
  var palette = {
    fur: "#f0a060",
    furLight: "#f7bd85",
    fringe: "#d9773a",
    fringeLight: "#e88c4c",
    snout: "#ffd9c4",
    innerEar: "#ffb8a0",
    horn: "#fff4dc",
    hornEdge: "#e8d3a8",
    hoof: "#8a4a26",
    blush: "#ff8fab",
    eye: "#2b1a12",
    mouth: "#8a3a22",
  };

  // Each growth stage changes the size and how grown-up the horns and fringe look.
  var stageShapes = {
    calf: { scale: 0.62, horns: 0, fringe: 0.75 },
    "young-calf": { scale: 0.74, horns: 0.4, fringe: 0.85 },
    young: { scale: 0.87, horns: 0.7, fringe: 0.95 },
    adult: { scale: 1, horns: 1, fringe: 1.05 },
  };

  function render(options) {
    var stage = options.stage || "egg";
    if (stage === "egg" || stage === "egg-cracked") {
      return wrap(drawEgg(stage === "egg-cracked"));
    }

    var shape = stageShapes[stage] || stageShapes.adult;
    var mood = options.mood || "happy";
    var parts = [
      drawTail(),
      drawBody(),
      drawHorns(shape.horns),
      drawEars(),
      drawHead(),
      drawEyes(mood),
      drawFringe(shape.fringe),
      drawSnout(mood),
      drawNeck(options.neck),
      drawFace(options.face),
      '<g transform="translate(0 -6)">' + drawHat(options.hat) + "</g>",
    ];
    if (mood === "sleepy") {
      parts.push(
        '<g class="cow-zzz"><text x="150" y="58" font-size="18" font-weight="900" fill="#8b9cc8">z</text>' +
          '<text x="164" y="40" font-size="24" font-weight="900" fill="#8b9cc8">Z</text></g>'
      );
    }
    if (mood === "sad") {
      parts.push('<path class="cow-sweat" d="M146 78 q6 10 0 14 q-6 -4 0 -14 Z" fill="#9fd4ff"/>');
    }

    return wrap(
      '<g transform="translate(100 194) scale(' + shape.scale + ') translate(-100 -194)">' +
        '<g class="cow-bob">' + parts.join("") + "</g></g>"
    );
  }

  function wrap(inner) {
    return (
      '<svg class="cow-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse class="cow-shadow" cx="100" cy="194" rx="46" ry="5" fill="rgba(0,0,0,0.1)"/>' +
      inner +
      "</svg>"
    );
  }

  function drawEgg(cracked) {
    var face = cracked
      ? // Peeking out, eyes open
        '<ellipse cx="88" cy="128" rx="5" ry="6" fill="' + palette.eye + '"/>' +
        '<ellipse cx="112" cy="128" rx="5" ry="6" fill="' + palette.eye + '"/>' +
        '<circle cx="90" cy="126" r="1.8" fill="#fff"/><circle cx="114" cy="126" r="1.8" fill="#fff"/>' +
        '<path d="M70 108 L82 98 L92 110 L102 96 L112 110 L122 98 L132 108" fill="none" stroke="#c99a74" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'
      : // Sleeping peacefully
        '<path d="M83 128 q5 5 10 0" fill="none" stroke="' + palette.eye + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M107 128 q5 5 10 0" fill="none" stroke="' + palette.eye + '" stroke-width="3" stroke-linecap="round"/>';
    return (
      '<g class="cow-egg' + (cracked ? " is-cracked" : "") + '">' +
      '<path d="M100 60 C130 60 146 104 146 136 C146 166 126 190 100 190 C74 190 54 166 54 136 C54 104 70 60 100 60 Z" fill="#fff8ee" stroke="#f3dcc2" stroke-width="3"/>' +
      '<circle cx="76" cy="104" r="9" fill="' + palette.furLight + '"/>' +
      '<circle cx="126" cy="160" r="11" fill="' + palette.furLight + '"/>' +
      '<circle cx="80" cy="170" r="6" fill="' + palette.furLight + '"/>' +
      '<circle cx="128" cy="100" r="5" fill="' + palette.furLight + '"/>' +
      // Fluffy ginger tuft on top of the egg
      '<g class="cow-fringe">' +
      '<circle cx="92" cy="62" r="8" fill="' + palette.fringe + '"/>' +
      '<circle cx="104" cy="56" r="9" fill="' + palette.fringe + '"/>' +
      '<circle cx="112" cy="64" r="6" fill="' + palette.fringe + '"/></g>' +
      '<ellipse cx="78" cy="140" rx="8" ry="5" fill="' + palette.blush + '" opacity="0.5"/>' +
      '<ellipse cx="122" cy="140" rx="8" ry="5" fill="' + palette.blush + '" opacity="0.5"/>' +
      face +
      "</g>"
    );
  }

  function drawTail() {
    return (
      '<g class="cow-tail">' +
      '<path d="M134 160 Q156 156 158 138" fill="none" stroke="' + palette.fur + '" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="158" cy="134" r="8" fill="' + palette.fringe + '"/>' +
      "</g>"
    );
  }

  function drawBody() {
    var legs = [70, 88, 100, 118]
      .map(function (x) {
        return (
          '<rect x="' + x + '" y="170" width="13" height="20" rx="6.5" fill="' + palette.fur + '"/>' +
          '<rect x="' + x + '" y="182" width="13" height="8" rx="4" fill="' + palette.hoof + '"/>'
        );
      })
      .join("");
    return (
      legs +
      '<ellipse cx="100" cy="162" rx="44" ry="26" fill="' + palette.fur + '"/>' +
      '<ellipse cx="100" cy="168" rx="26" ry="14" fill="' + palette.furLight + '"/>'
    );
  }

  function drawHorns(size) {
    if (!size) {
      return "";
    }
    // Soft, chunky cartoon horns that curl upwards
    function horn(side) {
      var baseX = 100 + side * 34;
      var tipX = 100 + side * (40 + 26 * size);
      var tipY = 62 - 26 * size;
      var bend = 100 + side * (46 + 26 * size);
      var path = "M" + baseX + " 64 Q" + bend + " 66 " + tipX + " " + tipY;
      var width = 9 + 5 * size;
      return (
        '<path d="' + path + '" fill="none" stroke="' + palette.hornEdge + '" stroke-width="' + (width + 3) + '" stroke-linecap="round"/>' +
        '<path d="' + path + '" fill="none" stroke="' + palette.horn + '" stroke-width="' + width + '" stroke-linecap="round"/>'
      );
    }
    return horn(-1) + horn(1);
  }

  function drawEars() {
    return (
      '<g class="cow-ear-left"><ellipse cx="48" cy="92" rx="17" ry="10" transform="rotate(-20 48 92)" fill="' + palette.fur + '"/>' +
      '<ellipse cx="50" cy="92" rx="9" ry="5" transform="rotate(-20 50 92)" fill="' + palette.innerEar + '"/></g>' +
      '<g class="cow-ear-right"><ellipse cx="152" cy="92" rx="17" ry="10" transform="rotate(20 152 92)" fill="' + palette.fur + '"/>' +
      '<ellipse cx="150" cy="92" rx="9" ry="5" transform="rotate(20 150 92)" fill="' + palette.innerEar + '"/></g>'
    );
  }

  function drawHead() {
    return (
      '<ellipse cx="100" cy="96" rx="52" ry="46" fill="' + palette.fur + '"/>' +
      '<ellipse cx="84" cy="74" rx="18" ry="10" fill="' + palette.furLight + '" opacity="0.6"/>'
    );
  }

  function drawEyes(mood) {
    if (mood === "surprised") {
      return (
        '<g class="cow-eyes">' +
        '<circle cx="84" cy="100" r="10" fill="#fff" stroke="' + palette.eye + '" stroke-width="2.5"/>' +
        '<circle cx="116" cy="100" r="10" fill="#fff" stroke="' + palette.eye + '" stroke-width="2.5"/>' +
        '<circle cx="84" cy="101" r="4.5" fill="' + palette.eye + '"/><circle cx="116" cy="101" r="4.5" fill="' + palette.eye + '"/>' +
        "</g>"
      );
    }
    if (mood === "sleepy") {
      return (
        '<path d="M76 102 q8 7 16 0" fill="none" stroke="' + palette.eye + '" stroke-width="3.5" stroke-linecap="round"/>' +
        '<path d="M108 102 q8 7 16 0" fill="none" stroke="' + palette.eye + '" stroke-width="3.5" stroke-linecap="round"/>'
      );
    }
    var eyes =
      '<g class="cow-eyes">' +
      '<ellipse cx="84" cy="100" rx="8" ry="10" fill="' + palette.eye + '"/>' +
      '<ellipse cx="116" cy="100" rx="8" ry="10" fill="' + palette.eye + '"/>' +
      '<circle cx="87" cy="96" r="3.4" fill="#fff"/><circle cx="119" cy="96" r="3.4" fill="#fff"/>' +
      '<circle cx="81" cy="104" r="1.6" fill="#fff"/><circle cx="113" cy="104" r="1.6" fill="#fff"/>' +
      "</g>";
    if (mood === "sad") {
      eyes +=
        '<path d="M74 86 L90 90" stroke="' + palette.fringe + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M126 86 L110 90" stroke="' + palette.fringe + '" stroke-width="3" stroke-linecap="round"/>';
    }
    return eyes;
  }

  function drawFringe(size) {
    // A puffy cloud of ginger hair on the forehead, the highland coo's signature look
    var puffs = [
      [70, 76, 13],
      [84, 68, 15],
      [100, 64, 17],
      [116, 68, 15],
      [130, 76, 13],
      [92, 80, 10],
      [108, 80, 10],
    ];
    var shapes = puffs
      .map(function (puff) {
        return (
          '<circle cx="' + puff[0] + '" cy="' + (puff[1] - (size - 1) * 10) + '" r="' + (puff[2] * size).toFixed(1) +
          '" fill="' + palette.fringe + '"/>'
        );
      })
      .join("");
    return (
      '<g class="cow-fringe">' + shapes +
      '<circle cx="96" cy="' + (58 - (size - 1) * 10) + '" r="' + (6 * size).toFixed(1) + '" fill="' + palette.fringeLight + '"/>' +
      '<path d="M98 ' + (50 - (size - 1) * 10) + ' q4 -12 12 -8" fill="none" stroke="' + palette.fringe + '" stroke-width="5" stroke-linecap="round"/>' +
      "</g>"
    );
  }

  function drawSnout(mood) {
    var mouths = {
      happy:
        '<path d="M92 128 Q100 138 108 128 Z" fill="' + palette.mouth + '"/>' +
        '<path d="M96 133 Q100 136 104 133" fill="none" stroke="#ff8fa3" stroke-width="3" stroke-linecap="round"/>',
      content: '<path d="M93 129 Q100 135 107 129" fill="none" stroke="' + palette.mouth + '" stroke-width="3" stroke-linecap="round"/>',
      sad: '<path d="M93 133 Q100 127 107 133" fill="none" stroke="' + palette.mouth + '" stroke-width="3" stroke-linecap="round"/>',
      sleepy: '<ellipse cx="100" cy="131" rx="3.5" ry="3" fill="' + palette.mouth + '"/>',
      surprised: '<ellipse cx="100" cy="132" rx="5" ry="6" fill="' + palette.mouth + '"/>',
    };
    return (
      '<ellipse cx="64" cy="116" rx="9" ry="6" fill="' + palette.blush + '" opacity="0.65"/>' +
      '<ellipse cx="136" cy="116" rx="9" ry="6" fill="' + palette.blush + '" opacity="0.65"/>' +
      '<ellipse cx="100" cy="124" rx="24" ry="15" fill="' + palette.snout + '"/>' +
      '<ellipse cx="91" cy="120" rx="2.6" ry="3.2" fill="' + palette.mouth + '"/>' +
      '<ellipse cx="109" cy="120" rx="2.6" ry="3.2" fill="' + palette.mouth + '"/>' +
      '<g class="cow-mouth">' + (mouths[mood] || mouths.happy) + "</g>"
    );
  }

  function drawHat(hat) {
    var hats = {
      "cow-bow":
        '<g transform="rotate(-12 128 58)"><path d="M128 58 L110 46 L112 70 Z" fill="#f472b6"/>' +
        '<path d="M128 58 L146 46 L144 70 Z" fill="#f472b6"/><circle cx="128" cy="58" r="6" fill="#db2777"/></g>',
      "cow-party-hat":
        '<path d="M100 4 L80 52 L120 52 Z" fill="#a78bfa"/>' +
        '<path d="M92 24 L108 24 M86 38 L114 38" stroke="#fde047" stroke-width="5"/>' +
        '<circle cx="100" cy="4" r="7" fill="#f472b6"/>',
      "cow-flower-crown": flowerRow(64, 136, 58, ["#f9a8d4", "#fde047", "#c4b5fd", "#fdba74", "#f9a8d4", "#86efac"]),
      "cow-crown":
        '<path d="M74 56 L74 28 L87 42 L100 22 L113 42 L126 28 L126 56 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>' +
        '<circle cx="100" cy="44" r="4" fill="#ec4899"/><circle cx="84" cy="48" r="3" fill="#38bdf8"/><circle cx="116" cy="48" r="3" fill="#38bdf8"/>',
      "cow-beret":
        '<ellipse cx="96" cy="50" rx="38" ry="13" transform="rotate(-8 96 50)" fill="#b91c1c"/>' +
        '<rect x="94" y="32" width="5" height="8" rx="2" fill="#7f1d1d"/>',
      "cow-cowboy-hat":
        '<ellipse cx="100" cy="56" rx="54" ry="10" fill="#92400e"/>' +
        '<path d="M74 56 Q72 22 88 24 Q100 32 112 24 Q128 22 126 56 Z" fill="#b45309"/>' +
        '<rect x="74" y="46" width="52" height="7" fill="#451a03"/>',
      "cow-safari-hat":
        '<ellipse cx="100" cy="56" rx="50" ry="9" fill="#d6c08a"/>' +
        '<path d="M72 56 Q72 22 100 22 Q128 22 128 56 Z" fill="#e7d3a0"/>' +
        '<rect x="72" y="46" width="56" height="7" fill="#4d7c0f"/>',
      "cow-beanie":
        '<path d="M70 58 Q70 20 100 20 Q130 20 130 58 Z" fill="#7c3aed"/>' +
        '<path d="M71 44 L129 44" stroke="#fde047" stroke-width="5"/><path d="M73 34 L127 34" stroke="#f472b6" stroke-width="4"/>' +
        '<rect x="68" y="52" width="64" height="9" rx="4" fill="#5b21b6"/><circle cx="100" cy="17" r="8" fill="#f472b6"/>',
      "cow-blossom-clip": flower(130, 58, "#f9a8d4", 8) + flower(144, 68, "#fbcfe8", 6),
    };
    return hats[hat] || "";
  }

  function drawFace(face) {
    var faces = {
      "cow-heart-glasses":
        heart(84, 100, "#ec4899") + heart(116, 100, "#ec4899") +
        '<path d="M96 98 L104 98" stroke="#be185d" stroke-width="3"/>',
      "cow-round-glasses":
        '<circle cx="84" cy="100" r="13" fill="rgba(255,255,255,0.25)" stroke="#1f2937" stroke-width="3"/>' +
        '<circle cx="116" cy="100" r="13" fill="rgba(255,255,255,0.25)" stroke="#1f2937" stroke-width="3"/>' +
        '<path d="M97 99 Q100 95 103 99" fill="none" stroke="#1f2937" stroke-width="3"/>',
    };
    return faces[face] || "";
  }

  function drawNeck(neck) {
    var necks = {
      "cow-bell":
        '<path d="M66 138 Q100 154 134 138" fill="none" stroke="#dc2626" stroke-width="7" stroke-linecap="round"/>' +
        '<g class="cow-bell"><path d="M92 146 L108 146 L112 164 L88 164 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>' +
        '<circle cx="100" cy="166" r="3" fill="#ca8a04"/></g>',
      "cow-scarf":
        '<path d="M62 136 Q100 156 138 136 L138 146 Q100 166 62 146 Z" fill="#0ea5e9"/>' +
        '<path d="M120 148 L130 176 L116 178 L110 152 Z" fill="#0ea5e9"/>' +
        '<path d="M80 143 L80 154 M100 147 L100 158 M120 143 L120 154" stroke="#e0f2fe" stroke-width="4"/>',
      "cow-bow-tie":
        '<path d="M100 148 L82 138 L82 158 Z" fill="#2563eb"/><path d="M100 148 L118 138 L118 158 Z" fill="#2563eb"/>' +
        '<circle cx="100" cy="148" r="5" fill="#1d4ed8"/>',
      "cow-lei": flowerRow(64, 136, 142, ["#f472b6", "#fde047", "#fb923c", "#a78bfa", "#f472b6", "#fde047", "#fb923c"], true),
    };
    return necks[neck] || "";
  }

  function flower(x, y, color, size) {
    var petals = "";
    for (var i = 0; i < 5; i += 1) {
      var angle = (i / 5) * Math.PI * 2;
      petals +=
        '<circle cx="' + (x + Math.cos(angle) * size * 0.7).toFixed(1) + '" cy="' +
        (y + Math.sin(angle) * size * 0.7).toFixed(1) + '" r="' + (size * 0.6).toFixed(1) + '" fill="' + color + '"/>';
    }
    return petals + '<circle cx="' + x + '" cy="' + y + '" r="' + (size * 0.45).toFixed(1) + '" fill="#fef08a"/>';
  }

  function flowerRow(startX, endX, y, colors, droop) {
    var result = "";
    var count = colors.length;
    for (var i = 0; i < count; i += 1) {
      var t = i / (count - 1);
      var x = startX + (endX - startX) * t;
      var curve = Math.sin(t * Math.PI) * (droop ? 12 : -6);
      result += flower(x, y + curve, colors[i], 7);
    }
    return result;
  }

  function heart(x, y, color) {
    return (
      '<path d="M' + x + " " + (y + 11) + " C" + (x - 17) + " " + y + " " + (x - 11) + " " + (y - 13) + " " + x + " " + (y - 4) +
      " C" + (x + 11) + " " + (y - 13) + " " + (x + 17) + " " + y + " " + x + " " + (y + 11) + ' Z" fill="' + color + '" opacity="0.92"/>'
    );
  }

  // Backgrounds for the cow's home. Moving parts (clouds, waves, snow) are animated in styles.css.
  function scene(id) {
    var scenes = {
      "home-meadow":
        sky("#dff3ff", "#f4fbff") +
        '<circle cx="160" cy="36" r="16" fill="#fde68a"/>' +
        cloud(30, 40) + cloud(110, 24) +
        '<path d="M0 132 Q60 112 120 128 T200 120 V200 H0 Z" fill="#bbf7d0"/>' +
        '<path d="M0 150 Q70 136 200 150 V200 H0 Z" fill="#86efac"/>' +
        tinyFlower(26, 168, "#f9a8d4") + tinyFlower(172, 176, "#fde047") + tinyFlower(150, 160, "#c4b5fd"),
      "home-glen":
        sky("#e9e5ff", "#fdf4ff") +
        cloud(120, 26) +
        '<path d="M0 124 L44 62 L78 104 L116 50 L160 102 L200 70 V200 H0 Z" fill="#a5b4fc"/>' +
        '<path d="M108 60 L116 50 L124 60 Z" fill="#fff"/><path d="M38 70 L44 62 L50 70 Z" fill="#fff"/>' +
        '<path d="M0 138 L56 96 L100 128 L150 92 L200 124 V200 H0 Z" fill="#818cf8" opacity="0.7"/>' +
        '<ellipse class="scene-wave" cx="150" cy="148" rx="46" ry="7" fill="#7dd3fc"/>' +
        '<path d="M0 150 Q80 140 200 156 V200 H0 Z" fill="#c084fc" opacity="0.55"/>' +
        '<path d="M0 162 Q90 150 200 166 V200 H0 Z" fill="#a3e635" opacity="0.8"/>' +
        tinyFlower(20, 178, "#d946ef") + tinyFlower(60, 184, "#c026d3") + tinyFlower(176, 182, "#d946ef"),
      "home-barn":
        '<rect width="200" height="200" fill="#c98a55"/>' +
        [0, 25, 50, 75, 100, 125, 150, 175]
          .map(function (x) {
            return '<rect x="' + x + '" y="0" width="25" height="150" fill="' + (x % 50 === 0 ? "#c98a55" : "#b97a47") + '"/>';
          })
          .join("") +
        '<rect x="128" y="22" width="48" height="40" rx="4" fill="#bae6fd" stroke="#7c4a24" stroke-width="5"/>' +
        '<path d="M152 22 V62 M128 42 H176" stroke="#7c4a24" stroke-width="4"/>' +
        '<g class="scene-lantern"><path d="M40 0 V20" stroke="#5b3a1e" stroke-width="2"/>' +
        '<rect x="32" y="20" width="16" height="20" rx="4" fill="#fde68a" stroke="#92400e" stroke-width="2"/></g>' +
        '<rect x="0" y="150" width="200" height="50" fill="#fcd34d"/>' +
        '<path d="M0 150 L12 142 L22 150 L36 140 L48 150 L60 143 L74 150 L90 141 L104 150 L118 142 L132 150 L146 140 L160 150 L174 143 L188 150 L200 144 V152 H0 Z" fill="#fbbf24"/>' +
        '<rect x="6" y="128" width="40" height="26" rx="5" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>' +
        '<path d="M6 141 H46" stroke="#d97706" stroke-width="2"/>',
      "home-beach":
        sky("#bae6fd", "#f0f9ff") +
        '<circle cx="40" cy="38" r="18" fill="#fde047"/>' +
        cloud(120, 30) +
        '<rect x="0" y="104" width="200" height="40" fill="#38bdf8"/>' +
        '<path class="scene-wave" d="M-20 112 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#e0f2fe" stroke-width="3"/>' +
        '<path d="M0 136 Q100 124 200 138 V200 H0 Z" fill="#fde68a"/>' +
        '<path d="M170 170 l4 -10 l4 10 l10 1 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 Z" fill="#fb923c"/>' +
        '<path d="M20 176 q8 -12 16 0 Z" fill="#f9a8d4"/>',
      "home-snow":
        sky("#c7d2fe", "#eef2ff") +
        '<circle cx="158" cy="34" r="14" fill="#fef9c3"/>' +
        '<path d="M0 132 Q60 118 120 130 T200 124 V200 H0 Z" fill="#f8fafc"/>' +
        tree(26, 128) + tree(176, 122) + tree(150, 134) +
        '<path d="M0 156 Q90 146 200 160 V200 H0 Z" fill="#ffffff"/>' +
        '<g class="scene-snow">' +
        [[20, 20], [60, 50], [100, 14], [140, 60], [180, 30], [40, 90], [120, 96], [170, 88], [80, 70]]
          .map(function (flake) {
            return '<circle cx="' + flake[0] + '" cy="' + flake[1] + '" r="2.4" fill="#fff"/>';
          })
          .join("") +
        "</g>",
    };
    return (
      '<svg class="scene-svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      (scenes[id] || scenes["home-meadow"]) +
      "</svg>"
    );
  }

  function sky(top, bottom) {
    var id = "sky" + top.replace("#", "");
    return (
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/>' +
      '<stop offset="1" stop-color="' + bottom + '"/></linearGradient></defs>' +
      '<rect width="200" height="200" fill="url(#' + id + ')"/>'
    );
  }

  function cloud(x, y) {
    return (
      '<g class="scene-cloud"><ellipse cx="' + x + '" cy="' + y + '" rx="18" ry="8" fill="#fff"/>' +
      '<circle cx="' + (x - 6) + '" cy="' + (y - 5) + '" r="8" fill="#fff"/><circle cx="' + (x + 6) + '" cy="' + (y - 7) + '" r="9" fill="#fff"/></g>'
    );
  }

  function tinyFlower(x, y, color) {
    return '<path d="M' + x + " " + (y + 10) + " V" + y + '" stroke="#16a34a" stroke-width="2"/>' + flower(x, y, color, 5);
  }

  function tree(x, y) {
    return (
      '<rect x="' + (x - 3) + '" y="' + (y + 18) + '" width="6" height="10" fill="#78350f"/>' +
      '<path d="M' + x + " " + (y - 22) + " L" + (x + 16) + " " + (y + 20) + " L" + (x - 16) + " " + (y + 20) + ' Z" fill="#15803d"/>' +
      '<path d="M' + x + " " + (y - 22) + " L" + (x + 7) + " " + (y - 4) + " L" + (x - 7) + " " + (y - 4) + ' Z" fill="#fff"/>'
    );
  }

  // Little friends who keep the grown-up coo company.
  function friend(id) {
    var friends = {
      "friend-sheep":
        '<ellipse cx="50" cy="92" rx="4" ry="8" fill="#4b3a36"/><ellipse cx="70" cy="92" rx="4" ry="8" fill="#4b3a36"/>' +
        [[42, 66, 14], [58, 60, 16], [74, 66, 14], [48, 78, 14], [68, 78, 14]]
          .map(function (puff) {
            return '<circle cx="' + puff[0] + '" cy="' + puff[1] + '" r="' + puff[2] + '" fill="#fff" stroke="#e5e7eb" stroke-width="2"/>';
          })
          .join("") +
        '<ellipse cx="60" cy="52" rx="12" ry="11" fill="#4b3a36"/>' +
        '<ellipse cx="46" cy="50" rx="7" ry="4" fill="#4b3a36"/><ellipse cx="74" cy="50" rx="7" ry="4" fill="#4b3a36"/>' +
        '<circle cx="56" cy="50" r="2.5" fill="#fff"/><circle cx="64" cy="50" r="2.5" fill="#fff"/>' +
        '<circle cx="60" cy="40" r="6" fill="#fff"/>',
      "friend-chick":
        '<path d="M52 96 V88 M68 96 V88" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="60" cy="68" r="24" fill="#fde047"/>' +
        '<path d="M38 70 q-8 -6 -2 -14" fill="#facc15"/><path d="M82 70 q8 -6 2 -14" fill="#facc15"/>' +
        '<circle cx="52" cy="62" r="3.5" fill="#2b1a12"/><circle cx="68" cy="62" r="3.5" fill="#2b1a12"/>' +
        '<path d="M56 70 L64 70 L60 76 Z" fill="#f97316"/>' +
        '<ellipse cx="46" cy="72" rx="4" ry="3" fill="#fda4af"/><ellipse cx="74" cy="72" rx="4" ry="3" fill="#fda4af"/>' +
        '<path d="M58 44 q2 -8 6 -2" fill="none" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>',
      "friend-piglet":
        '<rect x="44" y="84" width="8" height="12" rx="4" fill="#f9a8d4"/><rect x="68" y="84" width="8" height="12" rx="4" fill="#f9a8d4"/>' +
        '<ellipse cx="60" cy="72" rx="26" ry="20" fill="#fbcfe8"/>' +
        '<path d="M40 56 L44 44 L52 54 Z" fill="#f9a8d4"/><path d="M80 56 L76 44 L68 54 Z" fill="#f9a8d4"/>' +
        '<circle cx="51" cy="66" r="3" fill="#2b1a12"/><circle cx="69" cy="66" r="3" fill="#2b1a12"/>' +
        '<ellipse cx="60" cy="76" rx="9" ry="6" fill="#f9a8d4"/>' +
        '<circle cx="57" cy="76" r="1.8" fill="#be185d"/><circle cx="63" cy="76" r="1.8" fill="#be185d"/>' +
        '<path d="M86 70 q8 -4 4 -10 q-4 -4 -6 2" fill="none" stroke="#f9a8d4" stroke-width="3" stroke-linecap="round"/>',
    };
    if (!friends[id]) {
      return "";
    }
    return (
      '<svg class="friend-svg" viewBox="20 20 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="60" cy="97" rx="22" ry="3" fill="rgba(0,0,0,0.12)"/>' +
      '<g class="friend-bob">' + friends[id] + "</g></svg>"
    );
  }

  window.CowArt = { render: render, scene: scene, friend: friend };
})();
