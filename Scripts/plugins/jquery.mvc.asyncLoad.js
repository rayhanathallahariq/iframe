(function(n) {
    n.fn.farsiInput = function(t) {
        var t = n.extend({
            changeLanguageKey: 145,
            persianNumber: !1
        }, t)
          , i = "fa"
          , r = t.persianNumber ? [1711, 0, 0, 0, 0, 1608, 0, 0, 0, 1776, 1777, 1778, 1779, 1780, 1781, 1782, 1783, 1784, 1785, 0, 1705, 1572, 0, 1548, 1567, 0, 1616, 1571, 8250, 0, 1615, 0, 0, 1570, 1577, 0, 0, 0, 1569, 1573, 0, 0, 1614, 1612, 1613, 0, 0, 8249, 1611, 171, 0, 187, 1580, 1688, 1670, 0, 1600, 1662, 1588, 1584, 1586, 1740, 1579, 1576, 1604, 1575, 1607, 1578, 1606, 1605, 1574, 1583, 1582, 1581, 1590, 1602, 1587, 1601, 1593, 1585, 1589, 1591, 1594, 1592] : [1711, 0, 0, 0, 0, 1608, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1705, 1572, 0, 1548, 1567, 0, 1616, 1571, 8250, 0, 1615, 0, 0, 1570, 1577, 0, 0, 0, 1569, 1573, 0, 0, 1614, 1612, 1613, 0, 0, 8249, 1611, 171, 0, 187, 1580, 1688, 1670, 0, 1600, 1662, 1588, 1584, 1586, 1740, 1579, 1576, 1604, 1575, 1607, 1578, 1606, 1605, 1574, 1583, 1582, 1581, 1590, 1602, 1587, 1601, 1593, 1585, 1589, 1591, 1594, 1592]
          , u = function(n, t) {
            navigator.appName == "Microsoft Internet Explorer" ? window.event.keyCode = n : f(String.fromCharCode(n), t)
        }
          , f = function(n, t) {
            var i = t.target
              , r = i.selectionStart
              , u = i.selectionEnd
              , f = i.scrollTop;
            i.value = i.value.substring(0, r) + n + i.value.substring(u, i.value.length);
            i.focus();
            i.selectionStart = r + n.length;
            i.selectionEnd = r + n.length;
            i.scrollTop = f;
            t.preventDefault()
        }
          , e = function(n) {
            var r = n || window.event
              , u = r.keyCode ? r.keyCode : r.which;
            if (u == t.changeLanguageKey)
                return i = i == "en" ? "fa" : "en",
                !0
        }
          , o = function(n, t) {
            var i = n;
            switch (n) {
            case 1610:
                n = 1740;
                break;
            case 1603:
                n = 1705
            }
            t.shiftKey && n == 32 && (n = 8204);
            i != n && u(n, t)
        }
          , s = function(n) {
            var t, f, e, s;
            i == "fa" && (t = n || window.event,
            f = t.keyCode ? t.keyCode : t.which,
            o(f, t),
            e = t.charCode != 0 && t.which != 0,
            e && f > 38 && f < 123 && (s = r[f - 39] ? r[f - 39] : f,
            u(s, t)))
        };
        return this.each(function() {
            var t = n(this);
            t.keypress(function(n) {
                s(n)
            });
            t.keydown(function(n) {
                e(n)
            })
        })
    }
}
)(jQuery);
