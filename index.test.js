const bookings = require('./data/bookings.json')
const rooms = require('./data/rooms.json')
const roomsWithBookings = require('./data/roomsWithBookings.json')
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

    /*test("El formato de fechas no es el correcto", () => {
        const room = new Room(rooms[0].name,bookings,rooms[0].rate,rooms[0].discount)
        expect(room.isOccupied('40/12/2023')).toThrow(TypeError)
    })*/


})

describe("TEST OCCUPANCY PERCENTAGE", () => {

    test("No hay ocupación de esa habitación entre esas fechas", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('01/12/2023','4/12/2023')).toBe(0)
    })

    test("Hay ocupación de esa habitación entre esas fechas, pero con algun booking sin terminar el checkout", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('20/12/2023','29/12/2023')).toBe(80)
    })
    
    test("Hay ocupación de esa habitación entre esas fechas, pero el startDate empezando después del checkin de una booking", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('21/12/2023','28/12/2023')).toBe(75)
    })

    test("Hay ocupación de esa habitación entre el checkin y el checkout", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('07/12/2023','08/12/2023')).toBe(100)
    })

    test("Hay ocupación total de esa habitación entre esas fechas cogiendo todas las bookings de ese rango de fechas", () => {
        const room = new Room(rooms[1].name,bookings,rooms[1].rate,rooms[1].discount)
        expect(room.occupancyPercentage('10/12/2023','22/12/2023')).toBe(100)
    })
})


describe("TEST TOTAL OCCUPANCY PERCENTAGE",() => {

    test("Ocupación total de todas las habitaciones en ese rango de fechas", () => {

        expect(Room.totalOccupancyPercentage(roomsWithBookings,'20/12/2023','22/12/2023')).toBe(100)

    })

    test("No hay ninguna ocupación en ese rango de fechas", () => {

        expect(Room.totalOccupancyPercentage(roomsWithBookings,'01/12/2023','4/12/2023')).toBe(0)
    })

    test("Porcentaje parcial ocupado en ese rango de fechas", () => {

        expect(Room.totalOccupancyPercentage(roomsWithBookings,'05/12/2023','10/12/2023')).toBe(67)
    })


})


describe("TEST AVAILABLE ROOMS",() => {

    test("No hay ninguna habitación libre en ese rango de fechas", () => {

        expect(Room.availableRooms(roomsWithBookings,'05/12/2023','10/12/2023')).toEqual([])

    })

    test("Están todas las habitaciones libres en ese rango de fechas", () => {

        expect(Room.availableRooms(roomsWithBookings,'01/12/2023','04/12/2023')).toEqual(["hab1","hab2","hab3","hab4"])

    })

    test("hay algunas habitaciones libres en ese rango de fechas", () => {

        expect(Room.availableRooms(roomsWithBookings,'29/12/2023','31/12/2023')).toEqual(["hab1","hab4"])

    })
})


describe("TEST GET FEE",() => {

    test("Devuelve el precio total sin descuento", () => {

        const booking = new Booking(bookings[4].name,
                                    bookings[4].email,
                                    bookings[4].checkIn, 
                                    bookings[4].checkOut,
                                    bookings[4].discount,
                                    rooms[3])
        
        expect(booking.getFee()).toBe(25000)
    })

    test("Devuelve el precio total solo con descuento en el booking", () => {

        const booking = new Booking(bookings[4].name,
            bookings[0].email,
            bookings[0].checkIn, 
            bookings[0].checkOut,
            bookings[0].discount,
            rooms[3])

        expect(booking.getFee()).toBe(22500)
    })

    test("Devuelve el precio total con el descuento del booking y de la room", () => {

        const booking = new Booking(bookings[4].name,
            bookings[0].email,
            bookings[0].checkIn, 
            bookings[0].checkOut,
            bookings[0].discount,
            rooms[0])

        expect(booking.getFee()).toBe(7650)
    })
})


