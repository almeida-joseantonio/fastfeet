import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StatusBar, Alert } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';
import formatDate from '~/utils/formatDate';

import {
  Container,
  Header,
  Body,
  Card,
  HeaderCard,
  Title,
  Label,
  Text,
  DateContainer,
  Date,
  ActionContainer,
  TextAction,
  ActionButton,
} from './styles';

export default function DetailsDelivery({ route }) {
  const { navigate } = useNavigation();

  const profile = useSelector((state) => state.user.profile);

  const { data } = route.params;

  const [status, setStatus] = useState('');

  const startDate = data.start_date
    ? formatDate(data.start_date)
    : '- - / - - / - -';

  const endDate = data.end_date ? formatDate(data.end_date) : '- - / - - / - -';

  useEffect(() => {
    async function loadStatus() {
      if (!data.start_date) {
        setStatus('Pendente');
      }
      if (data.start_date && !data.end_date) {
        setStatus('Retirada');
      }
      if (data.start_date && data.end_date) {
        setStatus('Entregue');
      }
    }
    loadStatus();
  }, [data.end_date, data.start_date]);

  async function handleDelivery() {
    try {
      const response = await api.put(
        `deliverymans/${profile.id}/deliveriesstart`,
        {
          delivery_id: data.id,
        }
      );

      Alert.alert('Sucesso!', 'Retirada realizada com sucesso!');

      navigate('Dashboard');
    } catch ({ response }) {
      Alert.alert('Falha!', response.data.error);
    }
  }

  function handleNewProblem() {
    if (data.end_date) {
      Alert.alert('Ooops!', 'Entrega já realizada!');
      return;
    }
    navigate('NewProblemDelivery', { delivery_id: data.id });
  }

  function handleShowProblems() {
    navigate('ProblemsDelivery', { data });
  }

  function handleConfirmDelivery() {
    if (data.end_date) {
      Alert.alert('Ooops!', 'Entrega já realizada!');
      return;
    }
    navigate('ConfirmDelivery', { delivery_id: data.id });
  }

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#7d40e7" />

      <Header />
      <Body>
        <Card>
          <HeaderCard>
            <Icon name="local-shipping" size={24} color="#7d40e7" />
            <Title>Informações da entrega</Title>
          </HeaderCard>

          <Label>DESTINATÁRIO</Label>
          <Text>{data.recipient.name}</Text>

          <Label>ENDEREÇO DE ENTREGA</Label>
          <Text>
            {data.recipient.street}, {data.recipient.number},{' '}
            {data.recipient.city} - {data.recipient.state},{' '}
            {data.recipient.postal_code}
          </Text>

          <Label>PRODUTO</Label>
          <Text>{data.product}</Text>
        </Card>

        <Card>
          <HeaderCard>
            <Icon name="event" size={22} color="#7d40e7" />
            <Title>Status da encomenda</Title>
          </HeaderCard>

          <Label>STATUS</Label>
          <Text>{status}</Text>

          <DateContainer>
            <Date>
              <Label>DATA DE RETIRADA</Label>
              <Text>{startDate}</Text>
            </Date>

            <Date>
              <Label>DATA DE ENTREGA</Label>
              <Text>{endDate}</Text>
            </Date>
          </DateContainer>
        </Card>

        <ActionContainer>
          <ActionButton onPress={() => handleNewProblem()}>
            <Icon name="highlight-off" color="#e74040" size={24} />
            <TextAction>Informar Problema</TextAction>
          </ActionButton>

          <ActionButton onPress={() => handleShowProblems()}>
            <Icon name="info-outline" color="#e7BA40" size={24} />
            <TextAction>Visualizar Problemas</TextAction>
          </ActionButton>

          {data.start_date ? (
            <ActionButton onPress={() => handleConfirmDelivery()}>
              <Icon
                name="check-circle"
                backgroundColor="#eee"
                color="#7D40E7"
                size={24}
              />
              <TextAction>Confirmar entrega </TextAction>
            </ActionButton>
          ) : (
            <ActionButton onPress={() => handleDelivery()}>
              <Icon name="add-circle-outline" color="#7d40e7" size={24} />
              <TextAction>Retirar entrega</TextAction>
            </ActionButton>
          )}
        </ActionContainer>
      </Body>
    </Container>
  );
}

DetailsDelivery.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      data: PropTypes.shape({
        id: PropTypes.number,
        product: PropTypes.string,
        start_date: PropTypes.instanceOf(Date),
        end_date: PropTypes.instanceOf(Date),
        signature_id: PropTypes.shape(),
        recipient: PropTypes.shape({
          name: PropTypes.string,
          street: PropTypes.string,
          number: PropTypes.number,
          city: PropTypes.string,
          state: PropTypes.string,
          postal_code: PropTypes.number,
        }),
      }),
    }),
  }).isRequired,
};
