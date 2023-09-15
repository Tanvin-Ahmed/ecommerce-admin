import axios, { AxiosResponse } from "axios";

interface SaveStore {
  name: String;
}

interface GetStore {
  id: String;
  name: String;
  userId: String;
  createdAt: Date;
  updatedAt: Date;
}

class Store {
  #url = "/api/stores";

  constructor() {}

  async save(value: SaveStore): Promise<AxiosResponse<GetStore>> {
    return await axios.post<GetStore>(this.#url, value);
  }

  async getAll(): Promise<AxiosResponse<GetStore[]>> {
    return await axios.get<GetStore[]>(this.#url);
  }

  async getById(id: string): Promise<AxiosResponse<GetStore>> {
    return await axios.get<GetStore>(`${this.#url}/${id}`);
  }

  async getFirst(): Promise<AxiosResponse<GetStore>> {
    return await axios.get<GetStore>(`${this.#url}`);
  }

  async update(id: string, data: SaveStore): Promise<AxiosResponse<GetStore>> {
    return await axios.put<GetStore>(`${this.#url}/${id}`, data);
  }

  async delete(id: string): Promise<AxiosResponse<any>> {
    return await axios.delete(`${this.#url}/${id}`);
  }
}

export const store = new Store();
