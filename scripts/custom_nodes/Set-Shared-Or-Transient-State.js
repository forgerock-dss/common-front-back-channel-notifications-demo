var outcome = "Success";

// ---------- helpers ----------
function isObject(x){ return x !== null && typeof x === "object"; }
function toStr(x){ return (x === null || x === undefined) ? "" : String(x); }

function resolveFromNodeState(path) {
    var parts = String(path).trim().split(".");
    if (parts.length === 0) return undefined;
    var base = nodeState.get(parts[0]);
    if (parts.length === 1) return base;

    var cur = base;
    for (var i = 1; i < parts.length; i++) {
        if (!isObject(cur)) return undefined;
        cur = cur[parts[i]];
        if (cur === undefined || cur === null) return cur;
    }
    return cur;
}

function substitute(template) {
    try {
        return String(template).replace(/\$\{([^}]+)}/g, function(match, key){
            var val = resolveFromNodeState(key);
            return (val !== undefined && val !== null) ? String(val) : match;
        });
    } catch (e) {
        logger.error("Substitution error: " + e);
        outcome = "Error";
        return template;
    }
}

function putState(stateName, key, value) {
    if (stateName === "SHARED") {
        nodeState.putShared(key, value);
    } else if (stateName === "TRANSIENT") {
        nodeState.putTransient(key, value);
    } else {
        logger.error("Invalid properties.state: " + stateName);
        outcome = "Error";
    }
}

function maybeJson(value) {
    var s = String(value).trim();
    if ((s.charAt(0) === "{" && s.charAt(s.length - 1) === "}") ||
        (s.charAt(0) === "[" && s.charAt(s.length - 1) === "]")) {
        try { return JSON.parse(s); } catch (e) {}
    }
    return value;
}

// Define BEFORE use to avoid hoisting issues in Rhino
var processPair = function(stateName, pair) {
    try {
        var str = String(pair);
        var eqIdx = str.indexOf("=");
        if (eqIdx < 0) {
            logger.error("Invalid key=value pair (no '='): " + str);
            outcome = "Error";
            return;
        }
        var lh = str.substring(0, eqIdx).trim();
        var rh = str.substring(eqIdx + 1).trim();
        var result = maybeJson(substitute(rh));

        var dotIdx = lh.indexOf(".");
        if (dotIdx >= 0) {
            var baseKey = lh.substring(0, dotIdx);
            var subKey  = lh.substring(dotIdx + 1);
            var current = nodeState.get(baseKey);
            if (!isObject(current)) current = {};
            current[subKey] = result;
            putState(stateName, baseKey, current);
        } else {
            putState(stateName, lh, result);
        }
    } catch (e) {
        logger.error("Error processing pair '" + pair + "': " + e);
        outcome = "Error";
    }
};

// ---------- main ----------
try {
    var stateName = properties.state;
    var values = properties.values;

    if (!values) {
        logger.error("properties.values is empty");
        outcome = "Error";
    } else if (values.iterator && typeof values.length !== "number") {
        var it = values.iterator();
        while (it.hasNext()) {
            processPair(stateName, String(it.next()));
        }
    } else {
        for (var i = 0; i < values.length; i++) {
            processPair(stateName, String(values[i]));
        }
    }
} catch (outerError) {
    logger.error("Unexpected error: " + outerError);
    outcome = "Error";
}
