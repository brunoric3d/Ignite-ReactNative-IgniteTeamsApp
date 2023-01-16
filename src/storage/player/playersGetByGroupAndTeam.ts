import { PlayerStorageDTO } from './playerStorageDTO';
import { playersGetByGroup } from './playersGetByGroup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "@storage/storageConfig";

export async function playersGetByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await playersGetByGroup(group);
    const players = storage.filter(player => player.team === team)
    return players;
  } catch (error) {
    throw error;
  }
}