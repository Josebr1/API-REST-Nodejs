import jwt from "jwt-simple";

describe("Routes: Users", () => {
    const Users = app.db.models.Users;
    const jwtSecret = app.libs.config.jwtSecret;
    let token;

    beforeEach(done => {
        Users
            .destroy({where: {}})
            .then(() => Users.create({
                name: "John",
                email: "john@mail.net",
                password: "12345"
            }))
            .then(user => {
                token = jwt.encode({id: user.id}, jwtSecret);
                done();
            });
    });

    describe("GET /user", () => {
       describe("status 200", () => {
           it("returns an authenticated user", done => {
               request.get("/user")
                   .set("Authorization", `JWT ${token}`)
                   .expect(200)
                   .end((err, res) => {
                       expect(res.body.name).to.eql("John");
                       expect(res.body.email).to.eql("john@mail.net");
                       done(err);
                   });
           });
       });
    });

    describe("DELETE /user", () => {
        describe("status 200", () => {
            it("deletes an authenticated user", done => {
                request.delete("/user")
                    .set("Authorization", `JWT ${token}`)
                    .expect(204)
                    .end((err, res) => done(err));
            });
        });
    });

    describe("POST /users", () => {
        describe("creates a new user", done => {
            it("creates a new user", done => {
                request.post("/users")
                    .send({
                        name: "Jose",
                        email: "antonio.silva.code@gmail.com",
                        password: "123456789"
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.name).to.eql("Jose");
                        expect(res.body.email).to.eql("antonio.silva.code@gmail.com");
                        done(err);
                    });
            });
        });
    });
});