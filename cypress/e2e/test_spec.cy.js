
describe('Cypress on SouceLabs', ()=> {

    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/')
        cy.get('input[id="password"]').type("secret_sauce")
    })

    it('Login saucedemo standart user', () => {
        
        cy.get('input[id="user-name"]').type("standard_user")
        cy.get('input[id="login-button"]').click()

        cy.get('div[class="inventory_container"]', {timeout:5000}).should('be.visible')
        
      })

    it('Login soucedemo locked up user', () => {

        cy.get('input[id="user-name"]').type("locked_out_user")
        cy.get('input[id="login-button"]').click()

        cy.get('h3[data-test="error"]').invoke('text').should('eq','Epic sadface: Sorry, this user has been locked out.')
    })

    it('Remove items from cart on problem user', () => {

        cy.get('input[id="user-name"]').type("problem_user")
        cy.get('input[id="login-button"]').click()

        cy.get('div[class="inventory_container"]', {timeout:5000}).should('be.visible')

        cy.get('button[id="react-burger-menu-btn"]').click()
        cy.get('a[id="reset_sidebar_link"]').click()
        cy.reload()

        cy.get('div[class="inventory_item"]').eq(0).find('button').click()
        cy.get('div[class="inventory_item"]').eq(1).find('button').click()
        

        cy.get('span[class="shopping_cart_badge"]').invoke('text').should('eq','2')
        cy.get('div[class="inventory_item"]').eq(0).find('button').invoke('text').should('eq','Remove')
        cy.get('div[class="inventory_item"]').eq(1).find('button').invoke('text').should('eq','Remove')

        cy.get('div[class="inventory_item"]').eq(0).find('button').click()
        cy.get('div[class="inventory_item"]').eq(1).find('button').click()
        
        cy.get('a[class="shopping_cart_link"]').should('not.have.descendants')
        cy.get('div[class="inventory_item"]').eq(0).find('button').invoke('text').should('eq','Add to cart')
        cy.get('div[class="inventory_item"]').eq(1).find('button').invoke('text').should('eq','Add to cart')

    })

    it('Purchase items using standart user', function() {
    //it('Purchase items using standart user', () => {
        function alphaNumericRandom(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
           }
           return result;
        }

        function numericRandom(length) {
            var result           = '';
            var characters       = '0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
           }
           return result;
        }

        const firstName = alphaNumericRandom(8)
        const lastName = alphaNumericRandom(5)
        const postalCode = numericRandom(5)

        cy.get('input[id="user-name"]').type("standard_user")
        cy.get('input[id="login-button"]').click()

        cy.get('div[class="inventory_container"]', {timeout:5000}).should('be.visible')

        cy.get('button[id="react-burger-menu-btn"]').click()
        cy.get('a[id="reset_sidebar_link"]').click()
        cy.reload()

        cy.get('div[class="inventory_item"]').eq(0).find('button').click()
        cy.get('div[class="inventory_item"]').eq(1).find('button').click()

        cy.get('div[class="inventory_item"]').eq(0).find('div[class="inventory_item_price"]').invoke('text').as('price_one')
        cy.get('div[class="inventory_item"]').eq(1).find('div[class="inventory_item_price"]').invoke('text').as('price_two')

        cy.get('a[class="shopping_cart_link"]').click()

        cy.get('div[class="inventory_item_price"]').eq(0).invoke('text').then((p1) => {
            cy.get('@price_one').should('eq',p1)
        })
        cy.get('div[class="inventory_item_price"]').eq(1).invoke('text').then((p2) => {
            cy.get('@price_two').should('eq',p2)
        })

        cy.get('button[id="checkout"]').click()

        cy.get('input[id="first-name"]').type(firstName)
        cy.get('input[id="last-name"]').type(lastName)
        cy.get('input[id="postal-code"]').type(postalCode)

        cy.get('input[id="continue"]').click()

        cy.get('div[class="summary_subtotal_label"]').invoke('text').as('total_price')
        cy.get('div[class="summary_tax_label"').invoke('text').as('tax')
        cy.get('div[class="summary_total_label"').invoke('text').as('total_payment')

        cy.get('@total_price').then(function($total_price){

            const actual_total_price = $total_price.replace(/[^0-9.]/g,"")
            const price_1 = this.price_one.replace(/[^0-9.]/g,"")
            const price_2 = this.price_two.replace(/[^0-9.]/g,"")

            const expected_total_price = parseFloat(price_1) + parseFloat(price_2)
            if(expected_total_price != actual_total_price){
                throw new Error("Total price is incorrect..!!!!")
            }

            cy.log('Total price is correct.')
        })

        cy.get('@total_payment').then(function($total_payment){
            const actual_total_payment = $total_payment.replace(/[^0-9.]/g,"")
            const total_price = this.total_price.replace(/[^0-9.]/g,"")
            const purchase_tax = this.tax.replace(/[^0-9.]/g,"")

            const expected_total_payment = parseFloat(total_price) + parseFloat(purchase_tax)
            if(expected_total_payment != actual_total_payment){
                throw new Error("Total Payment is incorrect..!!!!")
            }

            cy.log('Total Payment is correct.')
        })

        cy.get('button[id="finish"]').click()

        cy.get('img[class="pony_express"]',{timeout:5000}).should('be.visible')
        cy.get('button[id="back-to-products"]',{timeout:5000}).should('be.visible')
        cy.get('span[class="title"]').invoke('text').should('eq','Checkout: Complete!')
    })

})