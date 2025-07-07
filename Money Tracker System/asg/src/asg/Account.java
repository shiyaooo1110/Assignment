package asg;

import java.util.ArrayList;
import java.util.*;
import java.util.UUID;

public class Account {
	private String name;
	private String email;
	private String ID;
	private String password;
	private Budget budget;
	private ArrayList<Income> income;
	private ArrayList<Expenses> expenses;

	public Account(String name, String email, String password, double amount)
	{
		this.name = name ; 
		this.email = email;
		ID = generateID();
		this.password = password;
		budget = new Budget(amount);
		this.income = new ArrayList<>();
		this.expenses = new ArrayList<>();
	}
	public String getName() 
	{
		return name;
	}

	public String getEmail()
	{
		return email;
	}

	public void setName(String name) 
	{
		this.name = name;
	}

	public void setEmail(String email) 
	{
		this.email = email;
	}

	public String generateID() 
	{
		return UUID.randomUUID().toString();  //UUID FUNCTION TO GENERATE RANDOM ID
	}

	public String getID() 
	{
		return ID;
	}

	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password= password;
	}
	
	public Income[] getIncomeList() 
	{
		Income[] incomes = new Income[income.size()];
		return income.toArray(incomes);
	}

	public Expenses[] getExpenseList() 
	{
		Expenses[] e = new Expenses[expenses.size()];		
		return expenses.toArray(e);
	}

	public void addIncome(int year, int month, int day, double theAmount, String theSource) 
	{
		Income newIncome = new Income(year,month,day,theAmount,theSource);
		income.add(newIncome);
	}

	public void addExpenses(int year, int month, int day, double theAmount, String theType) 
	{	
		Expenses newExpenses = new Expenses(year,month,day,theAmount,theType);
		expenses.add(newExpenses);
	}

	public void removeIncome(int year, int month, int day, double theAmount, String theSource) 
	{
		for(int i = 0 ; i < income.size(); i++) 
		{
			Income ic = income.get(i);
			if(ic.getYear() == year && ic.getMonth()== month && ic.getDay()== day && ic.getAmount()== theAmount && ic.getSource().equals(theSource)) 
			{
				income.remove(i);
				break;
			}
		}	
	}

	public void removeExpenses(int year, int month, int day,double theAmount, String theType)
	{
		for(int i = 0 ; i < expenses.size(); i++) 
		{
			Expenses expense = expenses.get(i);
			if(expense.getYear() == year && expense.getMonth()== month && expense.getDay()==day && expense.getAmount()== theAmount && expense.getType().equals(theType)) 
			{
				expenses.remove(i);
				break;
			}
		}
	}
	
	public boolean searchDailyIncome(int year,int month, int day)
	{
		Scanner input=new Scanner(System.in);
		if( year <= 0 )
			do {
				System.out.println("The year must be greater than 0!");	
				System.out.println("Please enter the year again");
				System.out.print("Year (eg. 2024): ");
				year=input.nextInt();
			}while( year <= 0 );
		if( month <= 0 || month >12 )
			do {
				System.out.println("The month can only be record from 1 to 12!");	
				System.out.println("Please enter the month again");
				System.out.print("Month (1-12): ");
				month=input.nextInt();
			}while( month <= 0 || month >12 );
		
		if( day <= 0 || day > 31 )
			do {
				System.out.println("The day can only be record from 1 to 31!");	
				System.out.println("Please enter the day again");
				System.out.print("Day (1-31): ");
				day=input.nextInt();
			}while( day <= 0 || day > 31 );
		
		boolean incAns=false;
		System.out.println("----------------------"+day+"/"+month+"/"+year+" Income Transaction----------------------");		
		System.out.println("Amount \t\t Source");
		Income[] i=getIncomeList();
		
		for(Income inc : i) 
		{
			if(year == inc.getYear() && month == inc.getMonth() && day == inc.getDay()) 
			{ 
				System.out.printf("RM%.2f \t %s",inc.getAmount(),inc.getSource());
				System.out.println();
				incAns=true;
			}
		}
		
		if(incAns==false)
			System.out.println("N/A");
		System.out.println();
		
		return incAns;
	}
	
	public boolean searchDailyExpense(int year,int month, int day)
	{
		Scanner input=new Scanner(System.in);
		if( year <= 0 )
			do {
				System.out.println("The year must be greater than 0!");	
				System.out.println("Please enter the year again");
				System.out.print("Year (eg. 2024): ");
				year=input.nextInt();
				System.out.println();
			}while( year <= 0 );
		if( month <= 0 || month >12 )
			do {
				System.out.println("The month can only be record from 1 to 12!");	
				System.out.println("Please enter the month again");
				System.out.print("Month (1-12): ");
				month=input.nextInt();
				System.out.println();
			}while( month <= 0 || month >12 );
		
		if( day <= 0 || day > 31 )
			do {
				System.out.println("The day can only be record from 1 to 31!");	
				System.out.println("Please enter the day again");
				System.out.print("Day (1-31): ");
				day=input.nextInt();
				System.out.println();
			}while( day <= 0 || day > 31 );
		
		boolean expAns=false;
		System.out.println("----------------------"+day+"/"+month+"/"+year+" Expense Transaction----------------------");
		System.out.println("Amount \t\t Type");
		Expenses[] e=getExpenseList();
		for(Expenses exp : e) 
		{
			if(exp.getYear()== year && exp.getMonth() == month && exp.getDay()== day) 
			{
				System.out.printf("RM%.2f \t %s",exp.getAmount(),exp.getType());
				System.out.println();
				expAns=true;
			}
		}
		if(expAns==false)
			System.out.println("N/A");
		System.out.println();
		
		return expAns;
	}

	public void editIncome(Income oldInc, Income newIc)
	{
		int index=income.indexOf(oldInc);
		income.set(index, newIc);
	}

	public void editExpense(Expenses oldExp, Expenses newExp) 
	{
		int index=expenses.indexOf(oldExp);
		expenses.set(index, newExp);
	}

	public Income getIncome(int year, int month, int day, double theAmount, String theSource) 
	{
		Income inc=null;
		for(Income i : income) 
		{
			if(i.getYear() == year && i.getMonth()== month && i.getDay()== day && i.getAmount()== theAmount && i.getSource().equals(theSource)) 
			{
				inc=i;
			}
		}
		return inc;
	}

	public Expenses getExpenses(int year, int month, int day,double theAmount, String theType) 
	{
		Expenses exp=null;
		for(Expenses e : expenses) 
		{
			if(e.getYear() == year && e.getMonth()== month && e.getDay()==day && e.getAmount()== theAmount && e.getType().equals(theType)) 
			{
				exp=e;
			}
		}
		return exp;
	}
	
	public void setBudget(double amount) 
	{
		budget.setLimit(amount);
	}

	public Budget getBudget() 
	{
		return budget;
	}
}
