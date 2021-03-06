/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input } from '@rocketseat/unform';
import { toast } from 'react-toastify';
import { MdAdd, MdSearch, MdChevronLeft, MdChevronRight } from 'react-icons/md';

import api from '~/services/api';
import history from '~/services/history';

import Container from '~/components/Container';
import Loading from '~/components/Loading';
import Empty from '~/components/Empty';
import TableContainer from '~/components/TableContainer';
import Item from './Item';

import { AddButton, Footer } from './styles';

export default function Recipient() {
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [page, setPage] = useState(1);

  const handleSearchRecipient = useCallback(({ search }) => {
    async function searchRecipient() {
      try {
        const response = await api.get(`/recipients`, {
          params: { q: search },
        });

        setRecipients(response.data);
      } catch ({ response }) {
        toast.error(response.error);
      }
    }
    searchRecipient();
  }, []);

  useEffect(() => {
    setLoading(true);

    async function loadRecipients() {
      try {
        const response = await api.get('/recipients', {
          params: { page },
        });

        setRecipients(response.data);
      } catch ({ response }) {
        toast.error(response.error);
      }
    }

    loadRecipients();

    setLoading(false);
  }, [page]);

  function handlePrevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }

  function handleNextPage() {
    if (recipients.length < 5) return;
    setPage(page + 1);
  }

  return (
    <Container>
      <h2>Gerenciando destinatárioss</h2>

      <div>
        <Form onSubmit={handleSearchRecipient}>
          <div>
            <MdSearch size={24} color="#999" />
            <Input
              name="search"
              type="search"
              placeholder="Buscar por destinatários"
            />
          </div>
        </Form>

        <AddButton onClick={() => history.push('recipients/new')} type="button">
          <MdAdd size={22} color="#fff" />
          Cadastrar
        </AddButton>
      </div>

      {loading ? (
        <Loading />
      ) : !recipients.length ? (
        <Empty name="destinatários" />
      ) : (
        <>
          <TableContainer>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>

            {recipients.map(recipient => (
              <Item recipient={recipient} />
            ))}
          </TableContainer>

          <Footer>
            <header>
              <button
                type="button"
                onClick={() => {
                  handlePrevPage();
                }}
              >
                <MdChevronLeft size={36} color="#7d40e7" />
              </button>
              <button
                type="button"
                onClick={() => {
                  handleNextPage();
                }}
              >
                <MdChevronRight size={36} color="#7d40e7" />
              </button>
            </header>
          </Footer>
        </>
      )}
    </Container>
  );
}
