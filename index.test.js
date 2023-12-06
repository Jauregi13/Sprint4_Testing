const bookings = require('./bookings.json')
const rooms = require('./rooms.json')
const { Room, Booking } = require('./index')


describe("TEST IS OCCUPIED",() => {

    test("La habitación no está ocupada en un día en concreto",() => {

        const room = new Room(rooms[0].name,bookings,rooms[0].rate,rooms[0].discount)
        expect(room.isOccupied('23/12/2023')).toBeFalsy()

    })

    test("La habitación está ocupada en el dia entre el check in y check out", () => {

        const room = new Room(rooms[0].name,bookings,rooms[0].rate,rooms[0].discount)
        expect(room.isOccupied('07/12/2023')).toBeTruthy()
    })

    test("La habitación está ocupada en el extremo del check in", () => {

        const room = new Room(rooms[0].name,bookings,rooms[0].rate,rooms[0].discount)
        expect(room.isOccupied('20/12/2023')).toBeTruthy()
    })

    test("La habitación está ocupada en el extremo del check out", () => {

        const room = new Room(rooms[0].name,bookings,rooms[0].rate,rooms[0].discount)
        expect(room.isOccupied('20/12/2023')).toBeTruthy()
    })


})

describe("TEST OCCUPANCY PERCENTAGE", () => {

    test("No hay ocupación de esa habitación entre esas fechas", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('01/12/2023','4/12/2023')).toBe(0)
    })

    test("Hay ocupación de esa habitación entre esas fechas sin terminar el checkout", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('20/12/2023','29/12/2023')).toBe(80)
    })
    
    /*test("Hay ocupación de esa habitación después del checkin", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('05/11/2023','15/11/2023')).toBe(0)
    })

    test("Hay ocupación de esa habitación entre el checkin y el checkout", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('05/11/2023','15/11/2023')).toBe(0)
    })*/

    /*test("Hay ocupación total de esa habitación entre esas fechas", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('10/12/2023','22/12/2023')).toBe(100)
    })*/
})


