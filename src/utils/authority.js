// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('veoride-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === "undefined"
      ? localStorage.getItem("veoride-authority")
      : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === "string") {
    return [authority];
  }
  // return authority || ["guest"];
  return authority;
}

export function setAuthority(authority) {
  // authority = ['get.customer.detail',"create.customer"]

  const proAuthority = typeof authority === "string" ? [authority] : authority;
  return localStorage.setItem(
    "veoride-authority",
    JSON.stringify(proAuthority)
  );
}
