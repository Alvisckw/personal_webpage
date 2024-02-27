
// return a Gaussian random number [0,1)
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
// using central limit theorem
export function gaussianRandom() {
    var rand = 0;

    for (var i = 0; i < 6; i ++) {
        rand += Math.random();
    }

    return rand / 6;
}
  

// convert a decimal number into hex format
export function hex(number) {
    return Math.floor(number).toString(16).padStart(6, '0')
}

// range of value for RGB, HSL, and Hex
// r,g,b: [0,255]
// h: [0,365]
// s,l : [0,1]
// hex: [#000000, #FFFFFF]

// convert colour hex into RGB
// input: 1 colour hex [#000000, #FFFFFF]
export function hex2Rgb(colourHex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colourHex);
    return [parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
    ]
}

// convert RGB into colour hex
// input: 1 array of length 3 or 6 (integer RGB, decimal RGB)
// return: 1 colour hex
export function rgb2Hex(rgb) {
    //if (rgb.length==6) rgb=[rgb[3],rgb[4],rgb[5]]  // use integer for conversion, cuz need to round off anyways
    return "#"
            + rgb[0].toString(16).padStart(2, '0')
            + rgb[1].toString(16).padStart(2, '0')
            + rgb[2].toString(16).padStart(2, '0');
}


// convert RGB into HSL
// input: 1 array of length 3 or 6 (integer RGB, decimal RGB) [0,255]
// return: 1 array of length 6 (integer HSL, decimal HSL) h:[0,365], s,l:[0,1]
export function rgb2Hsl(rgb) {
    if (rgb.length==6) rgb=[rgb[3],rgb[4],rgb[5]]

    // https://gist.github.com/mjackson/5311256
    let r = rgb[0]/255, g = rgb[1]/255, b = rgb[2]/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }

        h /= 6
        h *= 360
        s *= 100
        l *= 100
    }

    return [ Math.round(h), Math.round(s), Math.round(l), h,s,l ];
    // h: [0,360] -> round to integer (360 levels)
    // s,l: [0,1] -> round to 0.01 (100 levels)
}

/* OLD FUNCTIONS for HSL-RGB conversion
// a function for HSL-RGB conversion
function int_hue2rgb(p, q, t) {
    // https://gist.github.com/mjackson/5311256
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

export function hsl2Rgb0(hsl) {
    if (hsl.length==6) hsl=[hsl[3],hsl[4],hsl[5]]

    // https://gist.github.com/mjackson/5311256
    let h = hsl[0]/360, s = hsl[1]/100, l = hsl[2]/100
    var r, g, b

    if (s == 0) {
        r = g = b = l // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s
        var p = 2 * l - q

        r = int_hue2rgb(p, q, h + 1/3) * 255
        g = int_hue2rgb(p, q, h) * 255
        b = int_hue2rgb(p, q, h - 1/3) * 255
    }
    return [ Math.round(r), Math.round(g), Math.round(b), r,g,b ]
    // r,g,b: [0,255] -> round to integer (255 levels)
}
*/

// convert HSL into RGB
// input: 1 array of length 3 or 6 (integer HSL, decimal HSL) h:[0,365], s,l:[0,1]
// return: 1 array of length 6 (integer RGB, decimal RGB) [0,255]
export function hsl2Rgb(hsl) {
    // https://www.html-code-generator.com/javascript/color-converter-script
    if (hsl.length==6) hsl=[hsl[3],hsl[4],hsl[5]]
    var h = hsl[0]
    var s = hsl[1]/100
    var l = hsl[2]/100

    var C = (1 - Math.abs(2 * l - 1)) * s
    var hue = h / 60
    var X = C * (1 - Math.abs(hue % 2 - 1))
    var r=0, g=0, b=0

    if (hue >= 0 && hue < 1) {
        r = C; g = X;
    } else if (hue >= 1 && hue < 2) {
        r = X; g = C;
    } else if (hue >= 2 && hue < 3) {
        g = C; b = X;
    } else if (hue >= 3 && hue < 4) {
        g = X; b = C;
    } else if (hue >= 4 && hue < 5) {
        r = X; b = C;
    } else {
        r = C; b = X;
    }
    var m = l - C / 2
    r += m
    g += m
    b += m
    r *= 255
    g *= 255
    b *= 255
    return [Math.round(r), Math.round(g), Math.round(b), r,g,b];
}

// calculate relative luminance from RGB
// input: 1 array of length 3 or 6 (integer RGB, decimal RGB) [0,255]
// return: 1 decimal number [0,1]
export function luma(rgb) {
    if (rgb.length==6) rgb=[rgb[3],rgb[4],rgb[5]]

    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    let crgb = [rgb[0]/255, rgb[1]/255, rgb[2]/255]
    let index = [0,1,2]

    index.forEach((i) => {
        if (crgb[i] <= 0.03928) {crgb[i] /= 12.92}
        else {crgb[i] = ((crgb[i]+0.055)/1.055)**2.4}
    })
    return 0.2126 * crgb[0] //r
            + 0.7152 * crgb[1] //g
            + 0.0722 * crgb[2] //b
}

// calculate contrast ratio of 2 colours using hex
// input: 2 colour hex [#000000, #FFFFFF]
// return: 1 decimal number [1,21]
export function contrastRatio(hex1, hex2) {
    let luma1 = luma(hex2Rgb(hex1))
    let luma2 = luma(hex2Rgb(hex2))

    let lighter = Math.max(luma1, luma2)
    let darker = Math.min(luma1, luma2)

    return (lighter+0.05)/(darker+0.05)
}

// return the complementary colour of the provided hex
// input: 1 colour hex [#000000, #FFFFFF]
// return: 1 colour hex [#000000, #FFFFFF]
export function opposite(colourHex) {
    return "#"+hex(16777215-parseInt(colourHex.replace("#",""), 16))
}

// return an pure analogous colour pallete (up to 5 neighbour colours) from the provided hex with the provided change in H (HSL)/degree
// input: 1 colour hex [#000000, #FFFFFF], 1 integer [1..5], 1 decimal [0,360]
// return: 1 array of the provided number of hex [#000000, #FFFFFF]
export function analogous(colourHex, count=3, angle=Math.random()*(45-30)+30) { // angle: prefer 30-45 [0,360]
    let hsl = rgb2Hsl(hex2Rgb(colourHex))
    if (hsl[4] < 70) hsl[4]=Math.random()*30+70 // s>=0.7 not to be too gray
    hsl[5] = 50 // l=0.5 not to be anything white/black

    let palette = []
    let k = (count-1)/2
    for (let i = -Math.floor(k); i <= Math.ceil(k); i++) {
        palette.push(rgb2Hex(hsl2Rgb(
            [hsl[3]+angle*i + ((hsl[3]+angle*i<0)?360:0),
            hsl[4],
            hsl[5]]
        )))
    }
    return palette
}


// return an analogous colour pallet (up to 3 neighbour colours, then mono of the neighbours) from the provided hex with the provided change in H (HSL)/degree
// input: 1 colour hex [#000000, #FFFFFF], 1 integer [1..5], 1 decimal [0,360]
// return: 1 array of the provided number of hex [#000000, #FFFFFF]
export function analogous3(colourHex, count=3, angle=Math.random()*(45-30)+30) { // angle: prefer 30-45 [0,360]
    let hsl = rgb2Hsl(hex2Rgb(colourHex))
    if (hsl[4] < 70) hsl[1]=Math.random()*30+70 // s>=0.7 not to be too gray
    hsl[5] = 50 // l=0.5 not to be anything white/black
    let deltaLum = gaussianRandom()*(50-6)+6
    let deltaSign = Math.round(Math.random()) * 2 - 1

    // neighbours + mono of neighbours
    let palette = []
    for (let i = -1; i <= 1; i++) {
        if (i==-1) palette.push(rgb2Hex(hsl2Rgb(
            [hsl[3]+angle*i + ((hsl[3]+angle*i<0)?360:0),
            hsl[4],
            hsl[5]+deltaSign*deltaLum])))
        palette.push(rgb2Hex(hsl2Rgb(
            [hsl[3]+angle*i + ((hsl[3]+angle*i<0)?360:0),
            hsl[4],
            hsl[5]])))
        if (i==1) palette.push(rgb2Hex(hsl2Rgb(
            [hsl[3]+angle*i + ((hsl[3]+angle*i<0)?360:0),
            hsl[4],
            hsl[5]+deltaSign*deltaLum])))
    }

    let sign = Math.round(Math.random()) * 2 - 1
    switch (count) {
    case 1: palette = [palette[2]]; break;
    case 2: palette = [palette[2], palette[2+sign]]; break;
    case 3: palette = [palette[1], palette[2], palette[3]]; break;
    case 4: if (sign) {palette = [palette[1], palette[2], palette[3], palette[4]]}
            else {palette = [palette[0], palette[1], palette[2], palette[3]]} break;
    }
    
    return palette
}

// return a random integer from a range
function randomIntBtw(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// return an array of number with fixed interval
// input: 1 decimal, 1 integer, 1 decimal
// return: 1 array of the provided number of decimals
function interval(randomNumber, numIntervals, change) {
    var intervals = [];
    let intervalSize = change || Math.random()*(100 / numIntervals - 6)+6;
    if (change > 100/numIntervals) intervalSize=100/numIntervals

    // locate the section from start the input is in
    let section = Math.floor(randomNumber/intervalSize)
    // possible number of sections
    let totalSec = Math.floor(100/intervalSize)

    // position from input of the starting section of the palette (random)
    let secFromNum = randomIntBtw(-Math.min(numIntervals-1, section),
                                    Math.min(totalSec-(section+numIntervals), 0))


    for (let i = secFromNum; i < numIntervals+secFromNum; i++) {
        intervals.push((randomNumber + i*intervalSize));
    }

    //let randomAdd = Math.random()*(1-intervals.slice(-1)[0])
    //intervals = intervals.map(element => element + randomAdd)

    return intervals;
}

// return a monochromatic colour pallet (up to 5 mono colours) from the provided hex with the provided change in L (HSL)
// input: 1 colour hex [#000000, #FFFFFF], 1 integer [1..5], 1 decimal [0,1]
// return: 1 array of the provided number of hex [#000000, #FFFFFF]
export function monochromatic(colourHex, count=3, change) {
    let hsl = rgb2Hsl(hex2Rgb(colourHex))
    let lightness = hsl[5]
    let palette = []

    interval(lightness,count,change).forEach((light) => {
        palette.push(rgb2Hex(hsl2Rgb([hsl[3],hsl[4],light])))
    })

    return palette
}

// return a split complementary colour pallet (up to 5 colours) from the provided hex
// input: 1 colour hex [#000000, #FFFFFF], 1 integer [1..5]
// return: 1 array of the provided number of hex [#000000, #FFFFFF]
export function splitComplementary(colourHex, count) {
    let mono = monochromatic(colourHex)
    let ana = analogous(opposite(mono[1]))

    var palette
    let sign = Math.round(Math.random()) * 2 - 1

    switch (count) {
    case 1: palette = [mono[1]];break;
    case 2: palette = [mono[1], ana[0]];break;
    case 3: palette = [mono[1], ana[0], ana[2]];break;
    case 4: palette = [mono[1+sign],mono[1], ana[0], ana[2]];break;
    case 5: palette = [mono[0], mono[1], mono[2], ana[0], ana[2]];break;
    }

    return palette
}

// return a complementary colour pallet (up to 5 colours) from the provided hex
// input: 1 colour hex [#000000, #FFFFFF], 1 integer [1..5]
// return: 1 array of the provided number of hex [#000000, #FFFFFF]
export function complementary(colourHex, count) {
    let oppoColour = opposite(colourHex)

    let monoSelf = monochromatic(colourHex)
    let monoOppo = monochromatic(oppoColour)

    var palette
    let sign1 = Math.round(Math.random()) * 2 - 1
    let sign2 = Math.round(Math.random()) * 2 - 1

    switch (count) {
    case 1: palette = [monoSelf[1]];break;
    case 2: palette = [monoSelf[1], monoOppo[1]];break;
    case 3: palette = [monoSelf[1+sign1], monoSelf[1], monoOppo[1]];break;
    case 4: palette = [monoSelf[1+sign1], monoSelf[1], monoOppo[1], monoOppo[1+sign2]];break;
    case 5: palette = [monoSelf[0], monoSelf[1], monoSelf[2], monoOppo[1], monoOppo[1+sign2]];break;
    }

    return palette
}

// unfinished triadic pallette function
export function triadic(colourHex, count) {

    return analogous3(colourHex, 3, 120)


}