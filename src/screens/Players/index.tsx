import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { groupRemove } from "@storage/group/groupRemove";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/playerStorageDTO";
import { AppError } from "@utils/AppError";
import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Keyboard, TextInput } from "react-native";
import { Container, Form, HeaderList, PlayersTotal } from "./styles";

type RouteParams = {
  group: string;
}

export function Players() {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Team A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  const inputRef = useRef<TextInput>(null)
  const playersList = useRef<FlatList>(null);

  async function handleAddPlayer() {

    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Nova pessoa', 'Informe o nome da pessoa')
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await playerAddByGroup(newPlayer, group);
      setNewPlayerName('');
      await fetchPlayersByTeam();

      inputRef.current?.blur();

      playersList.current?.scrollToEnd();

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message);
      } else {
        console.log(error);
        Alert.alert('Nova pessoa', 'Não foi possível adicionar a pessoa')
      }
    }
  }
  async function handleRemovePlayer(name: string) {
    try {
      await playerRemoveByGroup(name, group)
      await fetchPlayersByTeam();
    } catch (error) {
      Alert.alert('Remover pessoa', 'Não foi possivel remover a pessoa')
    }

  }

  async function fetchPlayersByTeam() {
    try {
      const filteredPlayers = await playersGetByGroupAndTeam(group, team);
      setPlayers(filteredPlayers);
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível carregar as pessoas')
    }
  }

  async function handleRemoveGroup(group: string) {
    Alert.alert('Remover', 'Deseja remover o grupo?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim', onPress: async () => {
            try {
              await groupRemove(group)
              navigation.goBack();
            } catch (error) {

            }
          }
        }
      ]
    )


  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team])

  return (
    <Container>
      <Header showBackButton />
      <Highlight
        title={group}
        subtitle="Adicione a galera e separe os times"
      />
      <Form>
        <Input
          inputRef={inputRef}
          autoCorrect={false}
          placeholder="Nome da pessoa"
          onChangeText={setNewPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
          value={newPlayerName}
        />
        <ButtonIcon
          icon="add"
          type="PRIMARY"
          onPress={handleAddPlayer}
        />
      </Form>
      <HeaderList>
        <FlatList
          data={['Team A', 'Team B']}
          keyExtractor={item => item}
          renderItem={({ item }) =>
            < Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          }
          horizontal


        />
        <PlayersTotal>{players.length}</PlayersTotal>
      </HeaderList>
      <FlatList
        ref={playersList}
        data={players}
        keyExtractor={item => item.name}
        renderItem={({ item }) =>
          <PlayerCard name={item.name} onRemove={() => handleRemovePlayer(item.name)} />
        }
        ListEmptyComponent={() =>
          <ListEmpty message="Não há pessoas nesse time" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: 100 },
        players.length === 0 && { flex: 1 }]}
      />
      <Button title="Remover turma" type="SECONDARY" onPress={() => handleRemoveGroup(group)} />

    </Container>
  )
}