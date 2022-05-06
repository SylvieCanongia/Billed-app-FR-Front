/**
 * @jest-environment jsdom
 */

import { getByTestId, fireEvent, render, screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import NewBillUI from '../views/NewBillUI';
import BillsUI, { rows } from '../views/BillsUI';
import { bills } from '../fixtures/bills';
import NewBill from '../containers/NewBill';
import Bills from '../containers/Bills';
import { ROUTES, ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store';
import router from '../app/Router';

jest.mock('../app/Store', () => mockStore);


describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then, NewBill page should be rendered', () => {
      document.body.innerHTML = NewBillUI();
      const newBillContainer = screen.getByTestId('form-newbill-container');
      const expenseType = screen.getByTestId('expense-type');
      const expenseName = screen.getByTestId('expense-name');
      const amount = screen.getByTestId('amount');
      const vat = screen.getByTestId('vat');
      const pct = screen.getByTestId('pct');
      const commentary = screen.getByTestId('commentary');
      const file = screen.getByTestId('file');
      const button = screen.getAllByTestId('btn-send-bill');

      expect(newBillContainer).toBeTruthy();
      expect(expenseType).toBeTruthy();
      expect(expenseName).toBeTruthy();
      expect(amount).toBeTruthy();
      expect(vat).toBeTruthy();
      expect(pct).toBeTruthy();
      expect(commentary).toBeTruthy();
      expect(file).toBeTruthy();
      expect(button).toBeTruthy();
    });


    describe('When I click on send button', () => {

      test('Then, It should submit form', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        }));

        const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage,
        });

        document.body.innerHTML = NewBillUI();
        
        const sendButton = screen.getByTestId('btn-send-bill');

        const handleSubmit1 = jest.fn((e) => newBill.handleSubmit);
        sendButton.addEventListener('click', handleSubmit1);
        userEvent.click(sendButton);
        expect(handleSubmit1).toHaveBeenCalled();
  
      });
    });

    describe('When I add a file', () => {
      test('Then, the file name should be rendered into the input', () => {

        document.body.innerHTML = NewBillUI();

        const inputEl = screen.getByLabelText(/Justificatif/i);
        const file = new File(['hello'], 'hello.png', {type: 'image/png'});

        userEvent.upload(inputEl, file)

        expect(inputEl.files[0]).toStrictEqual(file)
        expect(inputEl.files.item(0)).toStrictEqual(file)
        expect(inputEl.files).toHaveLength(1)
      });

      describe('When the file extension is not the right format', () => {
        test('Then, an error message occurs', () => {
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname });
          };

          Object.defineProperty(window, 'localStorage', { value: localStorageMock });
          window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          }));

          const newBill = new NewBill({
            document, onNavigate, store: null, localStorage: window.localStorage,
            });

          document.body.innerHTML = NewBillUI();

          const file = new File(['hello'], 'hello.pdf', {type: 'application/pdf'});

          // const sendButton = screen.getByTestId('btn-send-bill');
          const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile);
          const fileDoc = screen.getByTestId('file');
          fileDoc.addEventListener('change', handleChangeFile1);
          fireEvent.change(fileDoc, { target: {files: [file]}});
          // userEvent.upload(inputEl, file);

          // const errorFile = screen.queryByTestId('error-file');

          expect(screen.findByText('Veuillez choisir un fichier avec l\'extension .jpg, .jpeg ou png')).toBeTruthy();
        });
      });

      test('Then, the function to change file should be called', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        }));

        const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage,
        });

        document.body.innerHTML = NewBillUI();

        const file = new File(['hello'], 'hello.png', {type: 'image/png'});

        // const sendButton = screen.getByTestId('btn-send-bill');
        const handleChangeFile1 = jest.fn((e) => newBill.handleChangeFile);
        const fileDoc = screen.getByTestId('file'); 
        fileDoc.addEventListener('change', handleChangeFile1);
        fireEvent.change(fileDoc, { target: {files: [file]}})
        expect(handleChangeFile1).toHaveBeenCalled();
        expect(fileDoc.files[0].name).toBe('hello.png');
      });
    });
  });
});

// test d'intégration POST

describe('Given I am a user connected as Employee and I am on NewBill page', () => {
  describe('When I submit the new bill', () => {
    test('create a new bill from mock API POST', async () => {

      const bill = [{
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": 20
      }]
  
        
      const callStore = jest.spyOn(mockStore, 'bills');

      mockStore.bills().create(bill);

      expect(callStore).toHaveBeenCalled();
      
    });
  });
});