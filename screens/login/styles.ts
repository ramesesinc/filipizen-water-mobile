import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  etracsLogo: {
    width: 180,
    height: 80
  },
  errorMsg: {
    color: 'red',
    marginBottom: 5
  },
  credentials: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderBottomWidth: 1,
    width: 250,
    margin: 5
  },
  loginButton: {
    backgroundColor: '#90B03E',
    width: 100,
    alignItems: 'center',
    padding: 5,
    margin: 30,
    borderRadius: 10,
  },
  loginText: {
    color: 'white'
  }
});