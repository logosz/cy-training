describe('Demo API test', () => {

    it('API Scenario 1', function(){
            cy.request(
                {
                method: 'GET',
                url: 'https://gorest.co.in/public/v1/todos',
                qs: {
                    status: 'completed',
                    title: '%20credo%20'
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.data).to.have.length(response.body.meta.pagination.total)
            })
    })

    it('API Scenario 2', function(){
        cy.request(
            {
                method: 'POST',
                url: 'https://gorest.co.in/public/v1/comments',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': Cypress.env('auth_token')
                },
                body:{
                    "post_id":1128, 
                    "name":"user", 
                    "email":"userflp@m.com", 
                    "body":"demo api testing"
                }
            }).then((response) => {
                expect(response.status).to.equal(201)
                expect(response.body.data.post_id).equal(1128)
                expect(response.body.data.name).equal('user')
                expect(response.body.data.email).equal('userflp@m.com')
                expect(response.body.data.body).equal('demo api testing')
            })
    })
})