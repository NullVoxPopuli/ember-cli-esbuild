export function loadStuff() {
  // located in host app
  return load('robert-bahn-98KcGRrN4LQ-unsplash.jpg');
}

async function load(url) {
  return await fetch(url).then((r) => r.blob());
}
