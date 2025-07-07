package asg;
import java.util.*;
import java.io.*;

public class BudgetTracker {

	public static void main(String[] args) {
		try {		
			Scanner input = new Scanner(System.in);
			Scanner file=new Scanner(new File("Account.txt"));
			String name, password, email;
			double amount;
						
			System.out.println("----------------------Budget Tracker----------------------");
			System.out.println("Please create an account: ");
			
			name=file.nextLine();
			System.out.println("Account name: " + name);			
			System.out.println();
			
			password=file.nextLine();
			System.out.println("Password: " + password);				
			System.out.println();
			
			email=file.nextLine();
			System.out.println("Email account: " + email);			
			System.out.println();
				
			amount=file.nextDouble();
			System.out.println("Please set a monthly expense budget(RM) : " + amount);			
			System.out.println();
						
			Account acc=new Account(name,password,email,amount);
			System.out.println("Your account is signed up Successfully!");
			System.out.println();
			
			
			int ans=0;
			do {
				System.out.println("======================== MENU =========================");
				System.out.println("Account Name: "+acc.getName());
				
				System.out.println();
				System.out.println("Please choose one action and enter the number (1-6) ");
				System.out.println("1. Add transaction");
				System.out.println("2. Edit transaction");
				System.out.println("3. Delete transaction");
				System.out.println("4. Display daily transaction");
				System.out.println("5. Display monthly report");
				System.out.println("6. Exit");
				
				do {
					System.out.print("Ans: ");
					ans=input.nextInt();
					System.out.println();
					if( ans<1 || ans>6 )
						System.out.println("Don't have this action! Please enter again!");
				}while( ans<1 || ans>6 );
				
				switch(ans)
				{
				case 1:
					addTransaction(acc,file);
					break;
				case 2:
					editTransaction(acc,file);
					break;
				case 3:
					deleteTransaction(acc,file);
					break;
				case 4:
					displayDailyTransaction(acc,file);
					break;
				case 5:
					displayMonthlyReport(acc);
					break;
				case 6:
					System.out.println("Thank you for using our app!");
					break;
				}
			}while( ans != 6 );
			
		}
		catch(IOException ex)
		{
			System.out.println("File error: "+ex.getMessage());
		}
		catch(InputMismatchException e)
		{
			System.out.println("Please enter a number!");
		}
		catch(NoSuchElementException e)
		{
			System.out.println(e.getMessage());
		}
		catch (NullPointerException e) 
		{
            System.out.println(e.getMessage());
        }
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
	}
	
	public static void addTransaction(Account a, Scanner file) throws FileNotFoundException
	{
		Scanner input = new Scanner(System.in);
		int ans;
		int year, month, day;
		double amount;
		String source, type;

		do {
			System.out.println("----------------------Add Transaction----------------------");
			System.out.println("Please choose one action and enter the number (1-3) ");
			System.out.println("1. Add income");
			System.out.println("2. Add expense");
			System.out.println("3. Exit");
			
			do {
				System.out.print("Ans: ");
				ans=input.nextInt();
				if( ans<1 || ans>3 )
					System.out.println("Don't have this action! Please enter again!");
			}while( ans<1 || ans>3 );
			
			System.out.println();
			switch(ans) {
			case 1:
				Scanner input1=new Scanner(new File("Income.txt"));
				System.out.println("----------------------Add Income----------------------");
				while(input1.hasNext())
				{
					System.out.println("Please enter the income information");
					System.out.print("Year (eg. 2024): ");
					year=input1.nextInt();
					System.out.println(year);
					
					System.out.print("Month (1-12): ");
					month=input1.nextInt();
					System.out.println(month);
					
					System.out.print("Day (1-31): ");
					day=input1.nextInt();
					System.out.println(day);
					
					System.out.print("Amount: ");
					amount=input1.nextDouble();
					System.out.println(amount);
					
					System.out.print("Source: ");
					source= input1.nextLine().trim();
					System.out.println(source);
					
					a.addIncome(year, month, day, amount, source);
					System.out.println("Income added succefully!");
					System.out.println(); 
				}
				
				break;
				 
			case 2:
				Scanner input2=new Scanner(new File("Expenses.txt"));
				System.out.println("----------------------Add Expense----------------------");
				while (input2.hasNext())
				{
					System.out.println("Please enter the expense information");
					System.out.print("Year (eg. 2024): ");
					year=input2.nextInt();
					System.out.println(year);
					
					System.out.print("Month (1-12): ");
					month=input2.nextInt();
					System.out.println(month);
					
					System.out.print("Day (1-31): ");
					day=input2.nextInt();
					System.out.println(day);
					
					System.out.print("Amount: ");
					amount=input2.nextDouble();
					System.out.println(amount);
					
					System.out.print("Type: ");
					type=input2.nextLine().trim();
					System.out.println(type);
					
					a.addExpenses(year, month, day, amount, type);
					System.out.println("Expense added succefully!");
					System.out.println();
				}				
				break;
			case 3:
				break;
			}
		}while( ans != 3 );
		
	}
	
	public static void editTransaction(Account a, Scanner file) throws FileNotFoundException
	{
		Scanner input = new Scanner(System.in);
		int ans;
		int year=0,month=0,day=0;
		double amount;
		String source, type;
		Income oldIncome, newIncome;
		Expenses oldExpense, newExpense;
		
		do {
			System.out.println("----------------------Edit Transaction----------------------");
			System.out.println("Please choose one action and enter the number (1-3) ");
			System.out.println("1. Edit income");
			System.out.println("2. Edit expense");
			System.out.println("3. Exit");

			do {
				System.out.print("Ans: ");
				ans=input.nextInt();
				if( ans<1 || ans>3 )
					System.out.println("Don't have this action! Please enter again!");
			}while( ans<1 || ans>3 );
		
			boolean incAns,expAns;
			System.out.println();
			if( ans == 1)
			{
				do {
					Scanner input1=new Scanner(new File("Transaction Date.txt"));
					System.out.println("----------------------Display Daily Transaction----------------------");
					System.out.println("Please enter the date of the transaction ");
					System.out.print("Year (eg. 2024): ");
					year=input1.nextInt();
					System.out.println(year);
					
					System.out.print("Month (1-12): ");
					month=input1.nextInt();
					System.out.println(month);
					
					System.out.print("Day (1-31): ");
					day=input1.nextInt();
					System.out.println(day);					
					
					System.out.println();
					incAns=a.searchDailyIncome(year, month, day);
					if( incAns == false )
					{
						System.out.println("This day don't have any income transaction!");
						System.out.println("Please enter the date information again");
						System.out.println();
					}
				}while( incAns == false );
			}
			else if( ans == 2 )
			{
				do {
					Scanner input2=new Scanner(new File("Transaction Date.txt"));
					System.out.println("----------------------Display Daily Transaction----------------------");
					System.out.println("Please enter the date of the transaction ");
					System.out.print("Year (eg. 2024): ");
					year=input2.nextInt();
					System.out.println(year);
					
					System.out.print("Month (1-12): ");
					month=input2.nextInt();
					System.out.println(month);
					
					System.out.print("Day (1-31): ");
					day=input2.nextInt();
					System.out.println(day);
					
					System.out.println();
					expAns=a.searchDailyExpense(year, month, day);
					
					if( expAns == false )
					{
						System.out.println("This day don't have any expense transaction!");
						System.out.println("Please enter the date information again");
						System.out.println();
					}
				}while( expAns == false );
			}
				
			switch(ans) {
			case 1:
				Scanner input0=new Scanner(new File("Edit Income Input.txt"));
				System.out.println("----------------------------Edit Income----------------------------");
				System.out.println("Please enter the original income information that you want to modify");
				while(input0.hasNext()) 
				{			
				do {
					System.out.print("Amount: ");
					amount=input0.nextDouble();
					System.out.println(amount);
					
					System.out.print("Source: ");
					source=input0.nextLine().trim();
					System.out.println(source);
					
					
					oldIncome=a.getIncome(year, month, day, amount, source);
					if( oldIncome == null )
					{
						System.out.println("Don't have this income transaction!");
						System.out.println("Please enter the information again");
						System.out.println();
					}
				}while( oldIncome == null );
				
				System.out.println();
				Scanner input1=new Scanner(new File("Edit Income.txt"));
				System.out.println("Please enter the latest income information: ");
				System.out.print("Year (eg. 2024): ");
				year=input1.nextInt();
				System.out.println(year);
				
				System.out.print("Month (1-12): ");
				month=input1.nextInt();
				System.out.println(month);
				
				System.out.print("Day (1-31): ");
				day=input1.nextInt();
				System.out.println(day);
				
				System.out.print("Amount: ");
				amount=input1.nextDouble();
				System.out.println(amount);
				
				System.out.print("Source: ");
				source=input1.nextLine().trim();
				System.out.println(source);
				
				newIncome=new Income(year,month,day,amount,source);
				a.editIncome(oldIncome, newIncome);
				System.out.println("Income edited successfully!");
				System.out.println();
				}
				break;
				
			case 2:
				Scanner input2=new Scanner(new File("Edit Expenses Input.txt"));
				System.out.println("----------------------------Edit Expense----------------------------");
				while(input2.hasNext())
				{					
				System.out.println("Please enter the original expense information that you want to modify");
				do {
					System.out.print("Amount: ");
					amount=input2.nextDouble();
					System.out.println(amount);					
					
					System.out.print("Source: "); 
					type=input2.nextLine().trim();
					System.out.println(type);
					
					
					oldExpense=a.getExpenses(year, month, day, amount, type);
					if( oldExpense == null )
					{
						System.out.println("Don't have this expense transaction!");
						System.out.println("Please enter the information again");
						System.out.println();
					}
				}while( oldExpense == null );
				System.out.println();
				
				Scanner input3=new Scanner(new File("Edit Expenses.txt"));
				System.out.println("Please enter the latest expense information: ");
				System.out.print("Year (eg. 2024): ");
				year=input3.nextInt();
				System.out.println(year);
				
				System.out.print("Month (1-12): ");
				month=input3.nextInt();
				System.out.println(month);
				
				System.out.print("Day (1-31): ");
				day=input3.nextInt();
				System.out.println(day);
				
				System.out.print("Amount: ");
				amount=input3.nextDouble();
				System.out.println(amount);
				
				System.out.print("Type: ");	
				type=input3.nextLine().trim();
				System.out.println(type);				
				
				newExpense=new Expenses(year,month,day,amount,type);
				a.editExpense(oldExpense, newExpense);
				System.out.println("Expense edited successfully!");
				System.out.println();
				}
				break;
			case 3:
				break;
			}
		}while( ans != 3 );
	}
	
	public static void deleteTransaction(Account a, Scanner file) throws FileNotFoundException
	{
		Scanner input = new Scanner(System.in);
		int ans;
		int year=0, month=0, day=0;
		double amount;
		String source, type;
		
		do {
			System.out.println("----------------------Delete Transaction----------------------");
			System.out.println("Please choose one action and enter the number (1-3) ");
			System.out.println("1. Delete income");
			System.out.println("2. Delete expense");
			System.out.println("3. Exit");

			do {
				System.out.print("Ans: ");
				ans=input.nextInt();
				if( ans<1 || ans>3 )
					System.out.println("Don't have this action! Please enter again!");
			}while( ans<1 || ans>3 );
		
			System.out.println();
			boolean incAns,expAns;
			if( ans == 1)
			{
				do {
					Scanner input1=new Scanner(new File("Transaction Date.txt"));
					System.out.println("----------------------Display Daily Transaction----------------------");
					System.out.println("Please enter the date of the transaction ");
					System.out.print("Year (eg. 2024): ");
					year=input1.nextInt();
					System.out.println(year);
					
					System.out.print("Month (1-12): ");
					month=input1.nextInt();
					System.out.println(month);
					
					System.out.print("Day (1-31): ");
					day=input1.nextInt();
					System.out.println(day);
					
					System.out.println();
					incAns=a.searchDailyIncome(year, month, day);
					
					if( incAns == false )
					{
						System.out.println("This day don't have any income transaction!");
						System.out.println("Please enter the date information again");
						System.out.println();
					}
				}while( incAns == false );
			}
			else if( ans == 2 )
			{
				do {
					Scanner input2=new Scanner(new File("Transaction Date.txt"));
					System.out.println("----------------------Display Daily Transaction----------------------");
					System.out.println("Please enter the date of the transaction ");
					System.out.print("Year (eg. 2024): ");
					year=input2.nextInt();
					System.out.println(year);
					
					System.out.print("Month (1-12): ");
					month=input2.nextInt();
					System.out.println(month);
					
					System.out.print("Day (1-31): ");
					day=input2.nextInt();
					System.out.println(day);
					
					System.out.println();
					expAns=a.searchDailyExpense(year, month, day);
					
					if( expAns == false )
					{
						System.out.println("This day don't have any expense transaction!");
						System.out.println("Please enter the date information again");
						System.out.println();
					}
				}while( expAns == false );
			}
			
			Income inc;
			Expenses exp;
			switch(ans) {
			case 1:
				Scanner input1=new Scanner(new File("Delete Income.txt"));
				System.out.println("----------------------------Delete Income----------------------------");
				while(input1.hasNext())
				{			
					do {
						System.out.println("Please enter the original income information that you want to delete");
						System.out.print("Amount: ");
						amount=input1.nextDouble();
						System.out.println(amount);
						
						System.out.print("Source: ");
						input.nextLine(); 
						source=input1.next();
						System.out.println(source);
						
						inc=a.getIncome(year, month, day, amount, source);
						if( inc == null )
						{
							System.out.println("Don't have this income transaction!");
							System.out.println("Please enter the information again");
							System.out.println();
						}
					}while(inc == null);
						 	
					a.removeIncome(year, month, day, amount, source);
					System.out.println("Income deleted successfully!");
					System.out.println();
						
				}
				break;
				
			case 2:
				Scanner input2=new Scanner(new File("Delete Expenses.txt"));
				System.out.println("----------------------------Delete Expense----------------------------");
				while (input2.hasNext())
				{
					do {
						System.out.println("Please enter the original expense information that you want to delete");
						System.out.print("Amount: ");
						amount=input2.nextDouble();
						System.out.println(amount);
						
						System.out.print("Type: ");
						input.nextLine(); 
						type=input2.next();
						System.out.println(type);
						
						exp=a.getExpenses(year, month, day, amount, type);
						if( exp == null )
						{
							System.out.println("Don't have this expense transaction!");
							System.out.println("Please enter the information again");
							System.out.println();
						}
					}while( exp == null );
					
					a.removeExpenses(year, month, day, amount, type);
					System.out.println("Expense deleted succefully!");
					System.out.println();
				}
				break;
			case 3:
				break;
			}
		}while( ans != 3 );
	}
	
	public static void displayDailyTransaction(Account a, Scanner file) throws IOException
	{
		Scanner input=new Scanner(new File("Daily Transaction Input.txt"));
		int year, month, day;
		
		System.out.println("----------------------Display Daily Transaction----------------------");
		System.out.println("Please enter the date of the transaction ");
		System.out.print("Year (eg. 2024): ");
		year=input.nextInt();
		System.out.println(year);
		
		System.out.print("Month (1-12): ");
		month=input.nextInt();
		System.out.println(month);
		
		System.out.print("Day (1-31): ");
		day=input.nextInt();
		System.out.println(day);
		
		System.out.println();
		
		double totalIncome = 0;
	    double totalExpenses = 0;
		
		PrintWriter writer = new PrintWriter("Daily Transaction.txt"); 		
		writer.println("----------------------"+day+"/"+month+"/"+year+" Transaction------------------------");
		
	    boolean incAns=false;
		writer.println("Income Transaction：");		
		writer.println("Amount \t\t Source");
				
		for(Income inc : a.getIncomeList()) 
			{
				if(year == inc.getYear() && month == inc.getMonth() && day == inc.getDay()) 
				{ 
					writer.printf("RM%.2f \t %s\n",inc.getAmount(),inc.getSource());
					totalIncome += inc.getAmount();					
					incAns=true;
				}
			}
		
		if(incAns==false)
			writer.println("N/A");
		
		if(totalIncome == 0)
		{
			writer.println();
			writer.println("No income transaction for this day");
		}			
		else
		{
			writer.println();
			writer.printf("Total Daily Income: RM%.2f",totalIncome);
		}		
			
		writer.println();
		
	    boolean expAns=false;
	    writer.println();
		writer.println("Expense Transaction：");
		writer.println("Amount \t\t Type");
		
		for(Expenses exp : a.getExpenseList()) 
		{
			if(exp.getYear()== year && exp.getMonth() == month && exp.getDay()== day) 
			{
				writer.printf("RM%.2f \t %s\n",exp.getAmount(),exp.getType());
				totalExpenses += exp.getAmount();					
				expAns=true;
			}
		}
		
		if(expAns==false)
			writer.println("N/A");
		
		if(totalExpenses == 0)
		{
			writer.println();
			writer.println("No Expenses transaction for this day");
		}			
		else
		{
			writer.println();
			writer.printf("Total Daily Expenses: RM%.2f",totalExpenses);			
		}					
							
		writer.println();		
		writer.println("------------------------------------------------------------------\n");	
	    writer.close();
	}
	
	public static void displayMonthlyReport(Account a) throws FileNotFoundException
	{
			PrintWriter writer = new PrintWriter("Monthly Report.txt");
			Scanner input = new Scanner(new File("Monthly Report Input.txt"));
			double totalIncome = 0;
		    double totalExpenses = 0;
		    
		    int year = input.nextInt();	
		    System.out.println("----------------------Monthly Report----------------------");
		    System.out.println("Please enter the year(eg. 2024): " + year);	
		    
		    int month = input.nextInt();
		    System.out.println("Please enter the month(1 - 12):" + month);
		    System.out.println();
		    
		    writer.println("----------------------Monthly Report----------------------");
		    writer.println("Income Transactions:");
		    writer.println("Date \t\t Amount \t Source");
		    for (Income inc : a.getIncomeList()) 
		    {
		        if (inc.getMonth() == month && inc.getYear() == year) 
		        {
		        	writer.printf("%02d/%02d/%d \t RM%.2f \t %s\n", inc.getDay(), inc.getMonth(), inc.getYear(), inc.getAmount(), inc.getSource());
		            totalIncome += inc.getAmount();
		        }
		    }
		    
		    if (totalIncome == 0) 
		    {
		    	writer.println("No income transactions for this month.");
		    }
		    
		    writer.println();

		    writer.println("Expense Transactions:");
		    writer.println("Date \t\t Amount \t Type");
		    for (Expenses exp : a.getExpenseList()) 
		    {
		        if (exp.getMonth() == month && exp.getYear() == year ) 
		        {
		        	writer.printf("%02d/%02d/%d \t RM%.2f \t %s\n", exp.getDay(), exp.getMonth(), exp.getYear(), exp.getAmount(), exp.getType());
		            totalExpenses += exp.getAmount();
		        }
		    }
		    
		    if (totalExpenses == 0) 
		    {
		    	writer.println("No expense transactions for this month.");
		    }
		    
		    writer.println();
		    
		    Budget b = a.getBudget();
		    double balance = totalIncome - totalExpenses;
		    writer.printf("Total Income: RM%.2f\n" , totalIncome);
		    writer.printf("Total Expenses: RM%.2f\n" , totalExpenses);
		    writer.printf("Budget of the month: RM%.2f\n" , b.getlimit());
		    writer.printf("Balance: RM%.2f\n" , balance);
		    
		    writer.println(); 
		    
		    if (b.getlimit() < totalExpenses)
		    {
		    	writer.println("Warning: You are out of budget!!!");
		    }
		    else
		    {
		    	writer.println("You are within your budget.");
		    }
		    
		    writer.println("----------------------------------------------------------\n");	
		    writer.close();
		    
		}  
}
