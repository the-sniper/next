//LOGO
export const LOGO = "/assets/svg/logo.svg";
export const BRAND_LOGO = "/assets/svg/brandLogo.svg";
export const SITE_NAME = "Auction.io";

export function getAllStyles(elem) {
  if (!elem) return [];
  var win = document.defaultView || window,
    style,
    styleNode = [];
  if (win.getComputedStyle) {
    style = win.getComputedStyle(elem, "");
    for (var i = 0; i < style.length; i++) {
      styleNode.push(style[i] + ":" + style.getPropertyValue(style[i]));
    }
  } else if (elem.currentStyle) {
    style = elem.currentStyle;
    for (var name in style) {
      styleNode.push(name + ":" + style[name]);
    }
  } else {
    style = elem.style;
    for (var i = 0; i < style.length; i++) {
      styleNode.push(style[i] + ":" + style[style[i]]);
    }
  }
  return styleNode;
}
