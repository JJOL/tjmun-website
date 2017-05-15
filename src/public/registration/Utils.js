// Utils
function getError(error, msg) {
  return {
    err: error,
    msg: msg
  };
}
function result(ok, info) {
  return {
    ok: function(){
      return ok;
    },
    getError: function() {
      return err;
    }
  }
}
function equalsInLowerCase(val, expect) {
  return expect.toLowerCase() == val;
}

function has(obj, thing) {
  if (obj instanceof Array) {
    return obj.indexOf(thing) !== -1;
  }
  return (obj[thing]);
}

function getValidator(e_role) {
  return function() {
    return equalsInLowerCase(this.role, e_role);
  };
}

function setObj(dest, src) {
  Object.keys(src).forEach(function(key) {
    dest[key] = src[key];
  });
}

function setArr(dest, src) {
  _.each(src, function(item) {
    dest.push(item);
  });
}
function clearArr(arr) {
  arr.splice(0, arr.length);
}
