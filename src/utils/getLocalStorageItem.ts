export function getLocalStorageData(key: string) {
  return JSON.parse(localStorage.getItem(key) || '{}');
}

export function setLocalStorageData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function removeLocalStorageData(key: string) {
  localStorage.removeItem(key);
}
