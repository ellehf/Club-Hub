import User from "./lib/user"

//Testing guide:
//npm install --save-dev jest
//Add test: "jest" to scripts section of package.json
//Run npm i -D @babel/preset-env
//Create file babel.config.js and paste this module.exports = {presets: ['@babel/preset-env']} 
//Type npm test in console to run test suite

//Initial test exists to make sure everything has been set up properly
test("initial test", ()=>{
    expect("a").toBe("a");
})


it('User getter functions', () => {
    const obj = new User("Sam", 3, "Computer Science", [],[]);
    expect(obj.getName()).toBe("Sam");
    expect(obj.getYear()).toBe(3);
    expect(obj.getMajor()).toBe("Computer Science");
    expect(obj.getMemberships()).toStrictEqual([]);
    expect(obj.getReviews()).toStrictEqual([]);             //Implement this once review class is done
});

