// Draws the pet highland cow as an SVG string.
// window.CowArt.render({ stage, mood, hat, face, neck }) returns SVG markup.
(function () {
  var palette = {
    fur: "#d9793a",
    furDark: "#b85a22",
    furDeep: "#8a4318",
    snout: "#f5c9a8",
    nostril: "#7a3b1c",
    horn: "#f3e6c8",
    hornTip: "#c9b48a",
    hoof: "#3b2314",
    blush: "#f48fb1",
    eye: "#2b1a12",
  };

  // Each growth stage changes the size and how grown-up the horns and fringe look.
  var stageShapes = {
    calf: { scale: 0.62, horns: 0, fringe: 0.8 },
    "young-calf": { scale: 0.74, horns: 0.35, fringe: 0.9 },
    young: { scale: 0.87, horns: 0.7, fringe: 1 },
    adult: { scale: 1, horns: 1, fringe: 1.1 },
  };

  function render(options) {
    var stage = options.stage || "egg";
    if (stage === "egg" || stage === "egg-cracked") {
      return wrap(drawEgg(stage === "egg-cracked"));
    }

    var shape = stageShapes[stage] || stageShapes.adult;
    var mood = options.mood || "happy";
    var parts = [
      drawBody(),
      drawHorns(shape.horns),
      drawEars(),
      drawHead(),
      drawEyes(mood),
      drawFringe(shape.fringe),
      drawSnout(mood),
      drawNeck(options.neck),
      drawFace(options.face),
      drawHat(options.hat),
    ];
    if (mood === "sleepy") {
      parts.push(
        '<g class="cow-zzz"><text x="150" y="60" font-size="18" font-weight="900" fill="#7c8db5">z</text>' +
          '<text x="164" y="42" font-size="24" font-weight="900" fill="#7c8db5">Z</text></g>'
      );
    }

    return wrap(
      '<g transform="translate(100 196) scale(' + shape.scale + ') translate(-100 -196)">' +
        '<g class="cow-bob">' + parts.join("") + "</g></g>"
    );
  }

  function wrap(inner) {
    return (
      '<svg class="cow-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="100" cy="196" rx="58" ry="5" fill="rgba(0,0,0,0.12)"/>' +
      inner +
      "</svg>"
    );
  }

  function drawEgg(cracked) {
    var crack = cracked
      ? '<path d="M66 118 L80 108 L90 120 L102 106 L114 120 L124 108 L134 118" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linejoin="round"/>'
      : "";
    return (
      '<g class="cow-egg' + (cracked ? " is-cracked" : "") + '">' +
      '<ellipse cx="100" cy="128" rx="46" ry="62" fill="#fff6ea" stroke="#f0d9bf" stroke-width="3"/>' +
      '<ellipse cx="80" cy="110" rx="12" ry="9" fill="' + palette.fur + '" opacity="0.75"/>' +
      '<ellipse cx="122" cy="150" rx="15" ry="11" fill="' + palette.fur + '" opacity="0.75"/>' +
      '<ellipse cx="92" cy="165" rx="8" ry="6" fill="' + palette.fur + '" opacity="0.75"/>' +
      '<ellipse cx="125" cy="100" rx="7" ry="5" fill="' + palette.fur + '" opacity="0.75"/>' +
      // A little ginger tuft poking out of the top of the egg
      '<path d="M88 70 Q92 52 98 68 Q102 48 108 68 Q114 54 114 72" fill="' + palette.furDark + '"/>' +
      crack +
      "</g>"
    );
  }

  function drawBody() {
    var legs = [58, 80, 112, 134]
      .map(function (x) {
        return (
          '<rect x="' + x + '" y="166" width="16" height="26" rx="7" fill="' + palette.furDeep + '"/>' +
          '<rect x="' + x + '" y="184" width="16" height="9" rx="4" fill="' + palette.hoof + '"/>'
        );
      })
      .join("");
    return (
      legs +
      '<ellipse cx="100" cy="156" rx="56" ry="32" fill="' + palette.fur + '"/>' +
      // Shaggy fur tufts along the belly
      '<path d="M50 162 q6 12 12 0 q6 12 12 0 q6 12 12 0 q6 12 12 0 q6 12 12 0 q6 12 12 0 q6 12 12 0 q6 12 12 0" fill="' +
      palette.fur + '"/>' +
      '<path d="M150 148 q16 4 12 22" fill="none" stroke="' + palette.furDark + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="162" cy="172" r="6" fill="' + palette.furDark + '"/>'
    );
  }

  function drawHorns(size) {
    if (!size) {
      return "";
    }
    // Thick horns that sweep out sideways and curl up at the tips
    var reach = 44 * size;
    var lift = 34 * size;
    var width = 6 + 6 * size;
    function horn(side) {
      var baseX = 100 + side * 30;
      var midX = 100 + side * (38 + reach * 0.8);
      var tipX = 100 + side * (42 + reach);
      var tip = tipX + " " + (74 - lift);
      var path = "M" + baseX + " 76 Q" + midX + " 82 " + tip;
      return (
        '<path d="' + path + '" fill="none" stroke="' + palette.hornTip + '" stroke-width="' + (width + 3) + '" stroke-linecap="round"/>' +
        '<path d="' + path + '" fill="none" stroke="' + palette.horn + '" stroke-width="' + width + '" stroke-linecap="round"/>' +
        '<circle cx="' + tipX + '" cy="' + (74 - lift) + '" r="' + (width / 2) + '" fill="' + palette.hornTip + '"/>'
      );
    }
    return horn(-1) + horn(1);
  }

  function drawEars() {
    return (
      '<ellipse cx="50" cy="96" rx="16" ry="8" transform="rotate(-18 50 96)" fill="' + palette.fur + '"/>' +
      '<ellipse cx="52" cy="96" rx="9" ry="4" transform="rotate(-18 52 96)" fill="#f0a878"/>' +
      '<ellipse cx="150" cy="96" rx="16" ry="8" transform="rotate(18 150 96)" fill="' + palette.fur + '"/>' +
      '<ellipse cx="148" cy="96" rx="9" ry="4" transform="rotate(18 148 96)" fill="#f0a878"/>'
    );
  }

  function drawHead() {
    return '<ellipse cx="100" cy="94" rx="46" ry="42" fill="' + palette.fur + '"/>';
  }

  function drawEyes(mood) {
    if (mood === "sleepy" || mood === "sad") {
      return (
        '<path d="M78 102 q6 5 12 0" fill="none" stroke="' + palette.eye + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M110 102 q6 5 12 0" fill="none" stroke="' + palette.eye + '" stroke-width="3" stroke-linecap="round"/>'
      );
    }
    return (
      '<ellipse cx="84" cy="103" rx="6" ry="7" fill="' + palette.eye + '"/>' +
      '<ellipse cx="116" cy="103" rx="6" ry="7" fill="' + palette.eye + '"/>' +
      '<circle cx="86" cy="106" r="2.2" fill="#fff"/>' +
      '<circle cx="118" cy="106" r="2.2" fill="#fff"/>'
    );
  }

  function drawFringe(size) {
    // The famous shaggy highland fringe, drooping over the eyes so they just peek out
    var top = 50 - 8 * size;
    var base = 90;
    var tipDrop = 10 + 5 * size;
    var strands = "";
    var xs = [56, 68, 80, 92, 104, 116, 128, 140, 144];
    for (var i = 0; i < xs.length - 2; i += 1) {
      var x = xs[i];
      var wobble = i % 2 === 0 ? 1 : -1;
      strands += " Q" + (x + 6 + wobble * 2) + " " + (base + tipDrop) + " " + (x + 12) + " " + base;
    }
    return (
      '<path d="M54 ' + (base + 2) + " Q54 " + (top + 6) + " 100 " + top + " Q146 " + (top + 6) + " 146 " + (base + 2) +
      " L140 " + base + " L56 " + base + ' Z" fill="' + palette.furDark + '"/>' +
      '<path d="M56 ' + base + strands + " L140 " + base + ' Z" fill="' + palette.furDark + '"/>' +
      '<path d="M70 ' + (top + 18) + " q8 10 4 24 M100 " + (top + 6) + " q4 12 0 26 M130 " + (top + 18) + ' q-8 10 -4 24" fill="none" stroke="' +
      palette.furDeep + '" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>' +
      '<path d="M90 ' + (top + 2) + " q4 -16 10 -2 q6 -16 12 2" + '" fill="' + palette.furDark + '"/>'
    );
  }

  function drawSnout(mood) {
    var mouth = {
      happy: '<path d="M92 128 Q100 136 108 128" fill="none" stroke="' + palette.nostril + '" stroke-width="3" stroke-linecap="round"/>',
      content: '<path d="M93 130 Q100 133 107 130" fill="none" stroke="' + palette.nostril + '" stroke-width="3" stroke-linecap="round"/>',
      sad: '<path d="M92 133 Q100 126 108 133" fill="none" stroke="' + palette.nostril + '" stroke-width="3" stroke-linecap="round"/>',
      sleepy: '<ellipse cx="100" cy="131" rx="4" ry="3" fill="' + palette.nostril + '"/>',
    };
    return (
      '<circle cx="66" cy="116" r="7" fill="' + palette.blush + '" opacity="0.6"/>' +
      '<circle cx="134" cy="116" r="7" fill="' + palette.blush + '" opacity="0.6"/>' +
      '<ellipse class="cow-snout" cx="100" cy="120" rx="28" ry="18" fill="' + palette.snout + '"/>' +
      '<ellipse cx="90" cy="116" rx="4" ry="5" fill="' + palette.nostril + '"/>' +
      '<ellipse cx="110" cy="116" rx="4" ry="5" fill="' + palette.nostril + '"/>' +
      (mouth[mood] || mouth.happy)
    );
  }

  function drawHat(hat) {
    var hats = {
      "cow-bow":
        '<g transform="rotate(-12 126 58)"><path d="M126 58 L108 46 L110 70 Z" fill="#f472b6"/>' +
        '<path d="M126 58 L144 46 L142 70 Z" fill="#f472b6"/><circle cx="126" cy="58" r="6" fill="#db2777"/></g>',
      "cow-party-hat":
        '<path d="M100 6 L80 54 L120 54 Z" fill="#a78bfa"/>' +
        '<path d="M92 26 L108 26 M86 40 L114 40" stroke="#fde047" stroke-width="5"/>' +
        '<circle cx="100" cy="6" r="7" fill="#f472b6"/>',
      "cow-flower-crown": flowerRow(64, 136, 56, ["#f9a8d4", "#fde047", "#c4b5fd", "#fdba74", "#f9a8d4", "#86efac"]),
      "cow-crown":
        '<path d="M74 58 L74 30 L87 44 L100 24 L113 44 L126 30 L126 58 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>' +
        '<circle cx="100" cy="46" r="4" fill="#ec4899"/><circle cx="84" cy="50" r="3" fill="#38bdf8"/><circle cx="116" cy="50" r="3" fill="#38bdf8"/>',
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
      "cow-blossom-clip":
        flower(128, 56, "#f9a8d4", 8) + flower(142, 66, "#fbcfe8", 6),
    };
    return hats[hat] || "";
  }

  function drawFace(face) {
    var faces = {
      "cow-heart-glasses":
        heart(84, 100, "#ec4899") + heart(116, 100, "#ec4899") +
        '<path d="M94 98 L106 98" stroke="#be185d" stroke-width="3"/>',
      "cow-round-glasses":
        '<circle cx="84" cy="100" r="12" fill="rgba(255,255,255,0.25)" stroke="#1f2937" stroke-width="3"/>' +
        '<circle cx="116" cy="100" r="12" fill="rgba(255,255,255,0.25)" stroke="#1f2937" stroke-width="3"/>' +
        '<path d="M96 99 Q100 95 104 99" fill="none" stroke="#1f2937" stroke-width="3"/>',
    };
    return faces[face] || "";
  }

  function drawNeck(neck) {
    var necks = {
      "cow-bell":
        '<path d="M66 134 Q100 150 134 134" fill="none" stroke="#dc2626" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M92 142 L108 142 L112 160 L88 160 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>' +
        '<circle cx="100" cy="162" r="3" fill="#ca8a04"/>',
      "cow-scarf":
        '<path d="M62 132 Q100 152 138 132 L138 142 Q100 162 62 142 Z" fill="#0ea5e9"/>' +
        '<path d="M120 144 L132 176 L118 178 L110 148 Z" fill="#0ea5e9"/>' +
        '<path d="M80 139 L80 150 M100 143 L100 154 M120 139 L120 150" stroke="#e0f2fe" stroke-width="4"/>',
      "cow-bow-tie":
        '<path d="M100 144 L82 134 L82 154 Z" fill="#2563eb"/><path d="M100 144 L118 134 L118 154 Z" fill="#2563eb"/>' +
        '<circle cx="100" cy="144" r="5" fill="#1d4ed8"/>',
      "cow-lei": flowerRow(64, 136, 140, ["#f472b6", "#fde047", "#fb923c", "#a78bfa", "#f472b6", "#fde047", "#fb923c"], true),
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
      '<path d="M' + x + " " + (y + 10) + " C" + (x - 16) + " " + y + " " + (x - 10) + " " + (y - 12) + " " + x + " " + (y - 4) +
      " C" + (x + 10) + " " + (y - 12) + " " + (x + 16) + " " + y + " " + x + " " + (y + 10) + ' Z" fill="' + color + '" opacity="0.92"/>'
    );
  }

  window.CowArt = { render: render };
})();
