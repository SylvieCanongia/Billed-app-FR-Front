/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from '@testing-library/dom';
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
    test('Then, NewBill page should be rendred', () => {
      document.body.innerHTML = NewBillUI();
      const newBillContainer = screen.findByText('class="form-newbill-container"');
      const expenseType = screen.getByTestId('expense-type');
      const expenseName = screen.getByTestId('expense-name');
      const amount = screen.getByTestId('amount');
      const vat = screen.getByTestId('vat');
      const pct = screen.getByTestId('pct');
      const commentary = screen.getByTestId('commentary');
      const file = screen.getByTestId('file');

      expect(newBillContainer).toBeTruthy();
      expect(expenseType).toBeTruthy();
      expect(expenseName).toBeTruthy();
      expect(amount).toBeTruthy();
      expect(vat).toBeTruthy();
      expect(pct).toBeTruthy();
      expect(commentary).toBeTruthy();
      expect(file).toBeTruthy();
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
        fireEvent.click(sendButton);
        expect(handleSubmit1).toHaveBeenCalled();
  
        // const bill = {
        //   email: 'employee@test.tld',
        //   type: 'Restaurants et bars',
        //   name:  "test3",
        //   amount: 200,
        //   date:  "2022-02-12",
        //   vat: 40,
        //   pct: 20,
        //   commentary: 'Test NewBill form fields',
        //   fileUrl: "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732",
        //   fileName: "preview-facture-free-201801-pdf-1.jpg",
        //   status: 'pending'
        // }
  
        // const updateBill2 = jest.fn((e) => newBill.updateBill(bill));
        // expect(updateBill2).toBeTruthy();
      });
    });
  });
});

// test d'intégration GET

 
 
 
 