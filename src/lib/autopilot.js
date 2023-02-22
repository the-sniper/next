const emptyStorageDriver = {
  getItem: () => null,
  setItem: () => null,
};

class Autopilot {
  constructor(dependencies = {}) {
    this.localStorage =
      dependencies.localStorage || typeof window !== 'undefined'
        ? window.localStorage
        : emptyStorageDriver;
    this.data = null;

    this.readLocalStorage();
  }

  readLocalStorage() {
    const data = this.localStorage.getItem('utm');

    return data ? JSON.parse(data) : data;
  }

  writeLocalStorage(data) {
    this.localStorage.setItem('utm', JSON.stringify(data));
  }

  clearLocalStorage() {
    this.localStorage.removeItem('utm');
  }

  readQueryParameters(location) {
    const data = Object.fromEntries(
      [...new URLSearchParams(location.search).entries()]
        .map(([key, value]) => [key.toLowerCase(), value])
        .filter(([key]) => key.toLowerCase().startsWith('utm_'))
        .map(([key, value]) => {
          const split = key.split('_');
          return [`${split[0]}${split[1].charAt(0).toUpperCase()}${split[1].slice(1)}`, value];
        })
    );

    if (Object.keys(data).length > 0) {
      this.writeLocalStorage(data);
    }
    return data;
  }
}

export default new Autopilot();
