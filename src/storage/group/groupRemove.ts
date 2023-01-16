import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig";
import { AppError } from "@utils/AppError";
import { groupsGetAll } from "./groupsGetAll";

export async function groupRemove(groupName: string) {
  try {
    const storedGroups = await groupsGetAll();
    const filteredGroups = storedGroups.filter(group => group !== groupName)

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(filteredGroups));
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupName}`)
  } catch (error) {
    throw new AppError('Não foi possível remover o grupo')
  }
}