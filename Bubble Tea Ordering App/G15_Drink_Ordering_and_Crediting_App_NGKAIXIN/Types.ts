
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;  
  Drawer: { 
    user_id: number,
    user_name: String,
  };
  DrinksDetails: {
    drinkId: number,
    userId: number,
  };
  Cart: {
    user_id: number,
  };
  Edit: {
    order_id: number,
    drink_id: number,
  };
  Payment: {
    orderId: number,
    userId: number,
    address: String,
    type: String,
    price: any,
  };
  PickUp: {
    orderId: number,
  };  
  Delivery: {
    orderId: number,
    name: String,
  };  
  Call: {
    phone: String,
  };
  Message : {
    driverName: String,
    userName: String,
  }
};

export type StackOptionList = {
  headerStyle: {
    backgroundColor: string,
  },
  headerTitleAlign: string,
  headerTintColor: string,
  headerTitleStyle: {
    fontWeight: string,
    fontSize: string,
  },
};

export type User = {
  id: number;
  username: string;
  password: string;
};