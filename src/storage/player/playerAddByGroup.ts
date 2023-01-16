import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLAYER_COLLECTION } from '@storage/storageConfig';
import { AppError } from '@utils/AppError';
import { playersGetByGroup } from './playersGetByGroup';
import { PlayerStorageDTO } from './playerStorageDTO';

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {
    const storedPlayers = await playersGetByGroup(group);

    const playerAlreadyInGroup = storedPlayers.filter(player => player.name === newPlayer.name);
    if (playerAlreadyInGroup.length > 0) {
      throw new AppError('Jogador já existe em um grupo')
    }

    const data = JSON.stringify([...storedPlayers, newPlayer])
    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, data)
  } catch (error) {
    throw error;
  }

}